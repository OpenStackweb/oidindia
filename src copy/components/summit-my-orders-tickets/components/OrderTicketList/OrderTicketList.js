import React from "react"
import classNames from 'classnames';
import { OrderTicketListItem } from './OrderTicketListItem';

import './order-ticket-list.scss';

export const OrderTicketList = ({ ticketType, tickets, summit, order, className }) => (
    <>
        <div className="order-ticket-list__type">{ticketType.name} Tickets ({tickets.length})</div>

        {tickets.length > 0 && (
            <ul className={classNames('order-ticket-list', className)}>
                {tickets.map((ticket) => (
                    <OrderTicketListItem key={ticket.id} ticket={ticket} summit={summit} order={order} />
                ))}
            </ul>
        )}
    </>
);
