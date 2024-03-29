import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from '../../../hooks'

import { BaseTableExpanded } from '../../tables'
import { TextInput, Paper } from "@mantine/core";

import { IconBarcode, IconCodeAsterix, IconUserCheck, } from "@tabler/icons";



const ExpandedProductList = ({ data }) => {
    return (
        <Paper m='xs' >


            <TextInput
                label='Customer name'
                readOnly
                value={data.customer.name}
                icon={<IconUserCheck />}
                radius='md'
                variant='filled'
                m='xs'
            />
            <TextInput
                m='xs'
                variant="filled"
                readOnly
                label='Product name'
                value={data.name}
                icon={<IconBarcode />}
                radius='md'
            />

            <TextInput
                m='xs'
                variant="filled"
                readOnly
                label='Product number'
                value={data.code}
                icon={<IconCodeAsterix />}
                radius='md'
            />

        </Paper>
    )
}


const ProductOrderList = () => {

    const { Get } = useRequest()

    const [productOrder, setProductOrder] = useState([])


    const columnProductOrderList = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.customer.name
        },
        {
            name: 'Product name',
            selector: row => row.name
        },
        {
            name: 'Product number',
            selector: row => row.code
        },
        {
            name: 'Rest of the order',
            selector: row => `${row.rest_order} Pcs`
        }
    ], [])


    useEffect(() => {
        const fetch = async () => {
            try {
                const productOrderList = await Get('list-product-in-order')
                setProductOrder(productOrderList)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])

    return (
        <>
            <BaseTableExpanded
                column={columnProductOrderList}
                data={productOrder}
                expandComponent={ExpandedProductList}
                noData="No product order"
            />
        </>
    )

}

export default ProductOrderList

