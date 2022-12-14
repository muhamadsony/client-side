import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useForm } from '@mantine/form'
import { createStyles, Card, LoadingOverlay, Table, Text, Button, Modal, TextInput, Group, Textarea, NumberInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import DataTable, { createTheme } from 'react-data-table-component'

import { IconPencil, IconTrashX, IconPlus, IconDotsCircleHorizontal, IconAt, IconWriting, IconDeviceMobile, IconMapPin, IconSquarePlus, IconUserPlus, IconUserCheck } from '@tabler/icons'


import { customTableStyle } from '../../services/External'
import BreadCrumb from '../BreadCrumb'
import { AuthContext } from '../../context/AuthContext'
import { SuccessNotif } from '../notifications/Notifications'
import { Get, Post } from '../../services/Request'


createTheme(
    'solarized',
    {
        text: {
            primary: '#f1f3f5',
            secondary: '#f1f3f5',
        },
        background: {
            default: '#141517',
        },
        context: {
            background: '#cb4b16',
            text: '#FFFFFF',
        },
        divider: {
            default: '#073642',
        },
        button: {
            default: '#2aa198',
            hover: 'rgba(0,0,0,.08)',
            focus: 'rgba(255,255,255,.12)',
            disabled: 'rgba(255, 255, 255, .34)',
        },
        sortFocus: {
            default: '#2aa198',
        },
    },
    'dark',
);


// const ExpandedComponent = ({ data }) => <pre>{data.symbol}</pre>;

const customerPageStyle = createStyles(() => ({

    wrapper: {
        display: 'flex',
        width: '100%',
    },
    leftDiv: {
        width: 1000,
        display: 'inline-block',
        marginRight: 50,
        paddingLeft: 0,

    },
    rightDiv: {
        width: 900,
        display: 'inline-block',
        backgroundColor: 'black',
        height: 800
    }

}))


const Customers = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const { classes } = customerPageStyle()
    const table = useRef()
    const form = useForm({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            email: ''
        }
    })
    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/customers',
            label: 'Customers'
        }
    ]
    const auth = useContext(AuthContext)

    const [opened, setOpened] = useState(false)
    const [visible, setVisible] = useState(false)
    const [dataCustomer, setDataCustomer] = useState([])


    const fetch = async () => {
        try {
            let data_customers = await Get(auth.user.token, 'customer')

            data_customers = data_customers.map((customer) => {
                return ({ ...customer, detailButton: <Button component={Link} to={`/home/marketing/customers/${customer.id}`} leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />} color='teal.8' variant='subtle' radius='md' >Detail</Button> })
            })

            setDataCustomer(data_customers)
        } catch (e) {
            if (e.message.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }
        }
    }

    useEffect(() => {
        fetch()
    }, [])

    const handlesubmit = async (data) => {
        // add new customer handle

        const token = auth.user.token
        setVisible((v) => !v)

        try {
            await Post(data, token, 'customer')
            SuccessNotif(' Add new customer success ????')
            fetch()
            form.reset()
            setOpened((o) => !o)
        } catch (e) {
            form.setErrors({ ...e.message.data })
            if (e.message.status === 401) {
                auth.resetToken(token, location.pathname)
                // expired token handle
            }
        } finally {
            setVisible((v) => !v)
        }

    }

    const column = useMemo(() => [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
        },
        {
            name: 'Email',
            selector: row => row.email,

        },
        {
            name: '',
            selector: row => row.detailButton,
            style: {
                padding: 0,
            }
        }

    ], [])

    return (

        <>
            <Group position='apart' >

                <BreadCrumb links={breadcrumb} />

                <Button
                    radius='md'
                    size='sm'
                    color='blue.6'
                    variant='outline'
                    leftIcon={<IconPlus stroke={2} size={20} />}
                    onClick={() => setOpened(true)} >
                    <Text size='md' >
                        Customer
                    </Text>
                </Button>
            </Group>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={
                    <Text weight={600} size='md' >
                        Add new customer
                    </Text>
                }
                radius='md'
            >
                <LoadingOverlay visible={visible} overlayBlur={2} />
                <form onSubmit={form.onSubmit(handlesubmit)} >

                    <TextInput
                        icon={<IconUserPlus size={15} stroke={2} />}
                        placeholder='Name'
                        label='Name'
                        withAsterisk
                        {...form.getInputProps('name')}

                    />

                    <TextInput
                        icon={<IconAt size={15} stroke={2} />}
                        mt='xs'
                        placeholder='Email'
                        label='Email'
                        withAsterisk
                        {...form.getInputProps('email')}
                        required
                    />

                    <NumberInput
                        icon={<IconDeviceMobile size={15} stroke={2} />}
                        mt='xs'
                        placeholder='Phone'
                        label='Phone'
                        withAsterisk
                        {...form.getInputProps('phone')}
                        required
                    />

                    <Textarea
                        icon={<IconMapPin size={20} stroke={2} />}
                        mt='lg'
                        label='Address'
                        withAsterisk
                        {...form.getInputProps('address')}
                        required
                    />

                    <Button leftIcon={<IconSquarePlus size={17} stroke={2} />} type='submit' color='green' variant='filled' radius='md' mt='lg' fullWidth >Submit</Button>
                </form>

            </Modal>

            <div className={classes.wrapper} >
                <div className={classes.leftDiv} >
                    <DataTable
                        columns={column}
                        data={dataCustomer}
                        customStyles={customTableStyle}
                        highlightOnHover={true}
                        pagination


                    />


                </div>



            </div>

        </>

    )

}


export default Customers







