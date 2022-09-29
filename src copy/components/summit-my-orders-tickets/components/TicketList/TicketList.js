import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import classNames from 'classnames';
import { getUserTickets } from "../../store/actions/ticket-actions";
import { TicketListItem } from './TicketListItem';

import './ticket-list.scss';

export const TicketList = ({ className }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        memberTickets: tickets,
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPage,
        total
    } = useSelector(state => state.ticketState || {});

    const handlePageChange = (page) => dispatch(getUserTickets({ page, perPage }));

    const hasTickets = tickets.length > 0;
    const hasMultiplePages = total > perPage;

    if (!hasTickets) return null;

    return (
        <>
            <h2 className="ticket-list__title">
                {t("tickets.title")}
            </h2>

            <ul className={classNames('ticket-list', className)}>
                {tickets.map(ticket => (
                    <TicketListItem key={ticket.id} ticket={ticket} />
                ))}
            </ul>

            {hasMultiplePages && (
                <div className="ticket-list__pagination">
                    <div className="row">
                        <div className="col-md-8">
                            <Pagination
                                bsSize="medium"
                                prev
                                next
                                first
                                last
                                ellipsis
                                boundaryLinks
                                maxButtons={5}
                                items={lastPage}
                                activePage={currentPage}
                                onSelect={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}