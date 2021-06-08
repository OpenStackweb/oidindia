const _ = require('lodash');
const axios = require('axios');
const path = require('path');
const fs = require("fs");
const { createFilePath } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');
const { ClientCredentials } = require('simple-oauth2');

const myEnv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const SSR_getMarketingSettings = async (baseUrl, summitId) => {
  const params = {
    per_page: 100,
  };

  return await axios.get(
      `${baseUrl}/api/public/v1/config-values/all/shows/${summitId}`,
      { params }
  )
      .then(response => response.data.data)
      .catch(e => console.log('ERROR: ', e));
};

exports.onPreBootstrap = async () => {
  const marketingData = await SSR_getMarketingSettings(process.env.GATSBY_MARKETING_API_BASE_URL, process.env.GATSBY_SUMMIT_ID);
  const colorSettings = JSON.parse(fs.readFileSync('src/content/colors.json'));
  const disqusSettings = JSON.parse(fs.readFileSync('src/content/disqus.json'));
  const marketingSite = JSON.parse(fs.readFileSync('src/content/marketing-site.json'));
  const homeSettings = JSON.parse(fs.readFileSync('src/content/home-settings.json'));
  const filterSettings = JSON.parse(fs.readFileSync('src/content/filters.json'));

  marketingData.map(({key, value}) => {
    if (key.startsWith('color_')) colorSettings[key] = value;
    if (key.startsWith('disqus_')) disqusSettings[key] = value;
    if (key.startsWith('summit_')) marketingSite[key] = value;
    if (key.startsWith('SCHEDULE_FILTER_BY_')) {
      const filterKey = key.substr(0, key.lastIndexOf('_')).substr(19).toLowerCase();
      if (key.includes('_ENABLED')) filterSettings[filterKey].enabled = (value === '1');
      if (key.includes('_LABEL')) filterSettings[filterKey].label = value;
    }
    if (key === 'SCHEDULE_EVENT_COLOR_ORIGIN') filterSettings.color_source = value;
    if (key === 'schedule_default_image') homeSettings.schedule_default_image = value;
  });

  fs.writeFileSync('src/content/colors.json', JSON.stringify(colorSettings), 'utf8');
  fs.writeFileSync('src/content/disqus-settings.json', JSON.stringify(disqusSettings), 'utf8');
  fs.writeFileSync('src/content/marketing-site.json', JSON.stringify(marketingSite), 'utf8');
  fs.writeFileSync('src/content/home-settings.json', JSON.stringify(homeSettings), 'utf8');
  fs.writeFileSync('src/content/filters.json', JSON.stringify(filterSettings), 'utf8');


  let sassColors = '';
  Object.entries(colorSettings).forEach(([key, value]) => sassColors += `$${key} : ${value};\n`);

  fs.writeFileSync('src/styles/colors.scss', sassColors, 'utf8');



  // Private API endpoints

  const config = {
    client: {
      id: process.env.GATSBY_OAUTH2_CLIENT_ID_BUILD,
      secret: process.env.GATSBY_OAUTH2_CLIENT_SECRET_BUILD
    },
    auth: {
      tokenHost: process.env.GATSBY_IDP_BASE_URL,
      tokenPath: process.env.GATSBY_OAUTH_TOKEN_PATH
    },
    options: {
      authorizationMethod: 'header'
    }
  };

  const getAccessToken = async () => {
    const client = new ClientCredentials(config);

    const tokenParams = {
      scope: process.env.GATSBY_BUILD_SCOPES
    };

    try {
      return await client.getToken(tokenParams);
    } catch (error) {
      console.log('Access Token error', error);
    }
  };

  const accessToken = await getAccessToken().then((token) => {
    return token.token.access_token
  });

  let events_page = 1;
  let events_last_page = 0;

  let allEvents = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/events/published`,
    {
      params: {
        access_token: accessToken,
        per_page: 50,
        page: events_page,
        expand: 'slides, links, videos, media_uploads type, track, location, location.venue, location.floor, speakers, moderator, sponsors, current_attendance, groups, rsvp_template',
      }
    }).then((response) => {
      events_last_page = response.data.last_page;
      return response.data.data;
    })
    .catch(e => console.log('ERROR: ', e));

    while (events_last_page > 1 && events_page <= events_last_page) {
    events_page++;
    await axios.get(
      `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/events/published`,
      {
        params: {
          access_token: accessToken,
          per_page: 50,
          page: events_page,
          expand: 'slides, links, videos, media_uploads type, track, location, location.venue, location.floor, speakers, moderator, sponsors, current_attendance, groups, rsvp_template',
        }
      }).then((response) => {
        allEvents = [...allEvents, ...response.data.data];
        return response.data;
      })
      .catch(e => console.log('ERROR: ', e));
  }

  fs.writeFileSync('src/content/events.json', JSON.stringify(allEvents), 'utf8');


  // Fetch Speakers

  // Get Featured Speakers

  let featured_speakers_page = 1;
  let featured_speakers_last_page = 0;

  let featuredSpeakers = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
    {
      params: {
        access_token: accessToken,
        page: featured_speakers_page,
        per_page: 30,
        'filter[]': 'featured==true',
      }
    }).then((response) => {
      featured_speakers_last_page = response.data.last_page;
      return response.data.data;
    })
    .catch(e => console.log('ERROR: ', e));

  while (featured_speakers_last_page > 1 && featured_speakers_page <= featured_speakers_last_page) {
    featured_speakers_page++;
    await axios.get(
      `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
      {
        params: {
          access_token: accessToken,
          page: featured_speakers_page,
          per_page: 30,
          'filter[]': 'featured==true',
        }
      }).then((response) => {
        featuredSpeakers = [...featuredSpeakers, ...response.data.data];
        return response.data;
      })
      .catch(e => console.log('ERROR: ', e));
  }

  featuredSpeakers = featuredSpeakers.map(speaker => ({ ...speaker, featured: true }));

  let speakers_page = 1;
  let speakers_last_page = 0;

  let allSpeakers = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
    {
      params: {
        access_token: accessToken,
        page: speakers_page,
        per_page: 30,
      }
    }).then((response) => {
      speakers_last_page = response.data.last_page;
      return response.data.data;
    })
    .catch(e => console.log('ERROR: ', e));

  while (speakers_last_page > 1 && speakers_page <= speakers_last_page) {
    speakers_page++;
    await axios.get(
      `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/v1/summits/${process.env.GATSBY_SUMMIT_ID}/speakers/on-schedule`,
      {
        params: {
          access_token: accessToken,
          page: speakers_page,
          per_page: 30,
        }
      }).then((response) => {
        allSpeakers = [...allSpeakers, ...response.data.data];
        return response.data;
      })
      .catch(e => console.log('ERROR: ', e));
  }

  allSpeakers = allSpeakers.filter(speaker => featuredSpeakers.every(s => s.id !== speaker.id));

  allSpeakers = [...allSpeakers, ...featuredSpeakers];

  fs.writeFileSync('src/content/speakers.json', JSON.stringify(allSpeakers), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

};

// makes Summit logo optional for graphql queries
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Summit implements Node {
      logo: String
    }
  `;
  createTypes(typeDefs)
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const { createNode } = actions;

  const summit = await axios.get(
    `${process.env.GATSBY_SUMMIT_API_BASE_URL}/api/public/v1/summits/${process.env.GATSBY_SUMMIT_ID}?expand=event_types%2C+tracks%2C+track_groups%2C+presentation_levels%2C+locations.rooms%2C+locations.floors`
  ).then((response) => response.data)
    .catch(e => console.log('ERROR: ', e));

  const summitObject = { summit };

  fs.writeFileSync('src/content/summit.json', JSON.stringify(summitObject), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  const nodeContent = JSON.stringify(summit);

  const nodeMeta = {
    ...summit,
    id: createNodeId(`summit-${summit.id}`),
    summit_id: summit.id,
    parent: null,
    children: [],
    internal: {
      type: `Summit`,
      mediaType: `application/json`,
      content: nodeContent,
      contentDigest: createContentDigest(summit)
    }
  };

  const node = Object.assign({}, summit, nodeMeta);
  createNode(node)
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;


  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()));
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach((edge) => {
      const id = edge.node.id;
      if (edge.node.fields.slug.match(/custom-pages/)) {
        edge.node.fields.slug = edge.node.fields.slug.replace('/custom-pages/', '/');
      }
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })
  })
};

exports.onCreateWebpackConfig = ({ actions, plugins, loaders }) => {
  actions.setWebpackConfig({
    // canvas is a jsdom external dependency
    externals: ['canvas'],
    plugins: [
      plugins.define({
        'global.GENTLY': false,
        'global.BLOB': false
      })
    ]
  })
};