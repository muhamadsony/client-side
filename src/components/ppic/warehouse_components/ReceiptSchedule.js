import React, { useState, useEffect, useMemo } from "react"
import { useRequest } from "../../../hooks"

import { BaseTable } from "../../tables"
import { TextInput, Group } from "@mantine/core"
import { IconSearch } from "@tabler/icons"


const ReceiptSchedule = () => {

    const { Get } = useRequest()
    const [schedule, setSchedule] = useState([])
    const [searchVal, setSearchVal] = useState('')

    const filteredSchedule = useMemo(() => {

        const filteredVal = searchVal.toLowerCase()

        return schedule.filter(sch => sch.date.toLowerCase().includes(filteredVal) ||
            sch.material_order.material.name.toLowerCase().includes(filteredVal) ||
            sch.material_order.purchase_order_material.supplier.name.toLowerCase().includes(filteredVal) ||
            sch.material_order.purchase_order_material.code.toLowerCase().includes(filteredVal))

    }, [schedule, searchVal])

    const columnMaterialReceiptSchedule = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.material_order.purchase_order_material.supplier.name
        },
        {
            name: 'Purchase order number',
            selector: row => row.material_order.purchase_order_material.code
        },
        {
            name: 'Material',
            selector: row => row.material_order.material.name
        },
        {
            name: 'Date',
            selector: row => new Date(row.date).toDateString()
        },
        {
            name: 'Arrival quantity',
            selector: row => row.quantity
        },
    ], [])


    useEffect(() => {
        Get('material-receipt-schedule').then(data => {
            setSchedule(data)
        })
    }, [])

    return (
        <>


            <Group position="right" >
                <TextInput
                    icon={<IconSearch />}
                    placeholder='Search schedule'
                    onChange={e => setSearchVal(e.target.value)}
                    value={searchVal}
                    radius='md'
                />
            </Group>

            <BaseTable
                column={columnMaterialReceiptSchedule}
                data={filteredSchedule}

                conditionalRowStyle={
                    [
                        {
                            when: row => new Date() > new Date(row.date),
                            style: {
                                backgroundColor: '#ffc9c9',
                                color: 'white',
                            },
                        },
                        {
                            when: row => Math.ceil((new Date(row.date) - new Date()) / (1000 * 3600 * 24)) <= 7 && Math.ceil((new Date(row.date) - new Date()) / (1000 * 3600 * 24)) > 0,
                            style: {
                                backgroundColor: '#fff3bf',
                                color: 'white',
                            },
                        }
                    ]
                }
            />

        </>
    )
}

export default ReceiptSchedule