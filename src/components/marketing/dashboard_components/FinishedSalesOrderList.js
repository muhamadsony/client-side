import { Button } from "@mantine/core";
import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";

const FinishedSalesOrderList = () => {

    const { Get } = useRequest()
    const [finishedSalesOrder, setFinishedSalesOrder] = useState([])

    const columnFinishedSalesOrder = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.customer.name
        },
        {
            name: 'No sales order',
            selector: row => row.code
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Total product order',
            selector: row => row.productorder_set.length
        },
        {
            name: '',
            selector: row => <Button
                radius='md'
                onClick={() => console.log('clicked')}
            >
                Make invoice
            </Button>
        }
    ], [])

    useEffect(() => {
        Get('finished-sales-order-list').then(data => {
            setFinishedSalesOrder(data)
        })
    }, [])


    return (
        <BaseTable
            noData="No finished sales order"
            column={columnFinishedSalesOrder}
            data={finishedSalesOrder}
        />
    )
}

export default FinishedSalesOrderList