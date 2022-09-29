import React from 'react';
import { TicketDetails } from '../TicketDetails/TicketDetails';

export const TicketListItem = ({ ticket, className }) => {
    if (!ticket) return null;

    return (
        <li className="ticket-list__item">
            <div className="ticket-list__item__content row">
                <div className="col-md-8">
                    <TicketDetails ticket={ticket} className={className} />
                </div>
            </div>
        </li>
    );
};