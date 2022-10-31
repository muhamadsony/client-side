import React, { useState, useEffect, useContext, } from "react"
import { TextInput, NumberInput, Select, Button, Paper, ThemeIcon, UnstyledButton, Group, Divider, Text, NativeSelect, Title } from "@mantine/core"
import { IconSortAscending2, IconBarcode, IconFileTypography, IconBuildingFactory, IconCodeAsterix, IconTimeline, IconArchive, IconAsset, IconCircleDotted, IconCircleCheck, IconXboxX, IconUser } from "@tabler/icons"

import { AuthContext } from "../../../context/AuthContext"
import { useRequest } from "../../../hooks/useRequest"
import { sectionStyle } from "../../../styles/sectionStyle"
import BreadCrumb from "../../BreadCrumb"
import { SuccessNotif, FailedNotif } from "../../notifications/Notifications"
import { useNavigate } from "react-router-dom"
import { openConfirmModal } from "@mantine/modals"



const NewProduction = () => {

    const auth = useContext(AuthContext)
    const { Get, Post, Loading } = useRequest()
    const { classes } = sectionStyle()
    const [machineList, setMachineList] = useState([])
    const [operatorList, setOperatorList] = useState([])
    const [productCustomer, setProductCustomer] = useState([])
    const [processList, setProcessList] = useState([])

    const [product, setProduct] = useState('')
    const [process, setProcess] = useState('')
    const [quantity, setQuantity] = useState(null)
    const [quantityNotGood, setQuantityNotGood] = useState(0)
    const [machine, setMachine] = useState('')
    const [operator, setOperator] = useState('')
    const navigate = useNavigate()

    const breadcrumb = [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/marketing/production',
            label: 'Production'
        },
        {
            path: `/home/ppic/production/new`,
            label: 'New production'
        }
    ]

    const handleSubmit = async () => {

        try {
            await Post({ product: product, quantity: quantity, quantity_not_good: quantityNotGood, machine: machine, operator: operator, process: process }, auth.user.token, 'production-report-management')
            SuccessNotif('Add production success')
            navigate('/home/ppic/production')
        } catch (e) {
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Add production failed')
            }
            console.log(e)
        }

    }


    const openConfirmSubmit = (e) => {
        e.preventDefault()

        return openConfirmModal({
            title: `Save new production`,
            children: (
                <Text size="sm">
                    Make sure all the requirements to produce this product are available.
                    Are you sure?, data will be saved.
                </Text>
            ),
            radius: 'md',
            labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
            cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
            confirmProps: { radius: 'md' },
            onConfirm: () => handleSubmit()
        })
    }

    useEffect(() => {

        Get(auth.user.token, 'production-list').then(data => {
            const dataProduct = data.reduce((prev, current) => {
                const product = current.ppic_product_related.map(product => ({ ...product, group: current.name }))
                return [...prev, ...product]
            }, [])

            setProductCustomer(dataProduct)
        })

        Get(auth.user.token, 'machine').then(data => {
            setMachineList(data)
        })

        Get(auth.user.token, 'operator').then(data => {
            setOperatorList(data)
        })

    }, [auth.user.token])


    return (
        <>

            <BreadCrumb links={breadcrumb} />

            <Title className={classes.title} >
                New production
            </Title>

            <Loading />

            <form onSubmit={openConfirmSubmit}  >


                <Select
                    m='xs'
                    icon={<IconBarcode />}
                    label='Product'
                    placeholder="Pick a product"
                    searchable
                    nothingFound="No products"
                    radius='md'
                    data={productCustomer.map(data => ({ value: data.id, label: data.name, group: data.group }))}
                    value={product}
                    required
                    onChange={(value) => {
                        setProduct(value)
                        const process = productCustomer.find(product => product.id === parseInt(value)).ppic_process_related
                        setProcessList(process)
                        setProcess('')
                    }}

                />

                <TextInput
                    radius='md'
                    label='Product number'
                    icon={<IconCodeAsterix />}
                    value={product !== '' ? productCustomer.find(prod => prod.id === parseInt(product)).code : ''}
                    readOnly
                    m='xs'
                />

                <Group grow m='xs'>

                    <NativeSelect
                        placeholder="Pick process"
                        label='Process'
                        required
                        radius='md'
                        icon={<IconTimeline />}
                        data={processList.map(process => ({ value: process.id, label: process.process_name }))}
                        value={process}
                        onChange={(e) => {
                            setProcess(e.target.value)
                        }}
                    />

                    <TextInput
                        radius='md'
                        label='Process type'
                        icon={<IconFileTypography />}
                        readOnly
                        value={process !== '' ? processList.find(pros => pros.id === parseInt(process)).process_type.name : ''}
                    />

                    <TextInput
                        icon={<IconSortAscending2 />}
                        radius='md'
                        label='wip'
                        readOnly
                        value={process !== '' ? processList.find(pros => pros.id === parseInt(process)).order : ''}
                    />
                </Group>


                <Select
                    radius='md'
                    placeholder="Select machine"
                    data={machineList.map(machine => ({ value: machine.id, label: machine.name }))}
                    value={machine}
                    onChange={e => setMachine(e)}
                    label='Machine'
                    m='xs'
                    icon={<IconBuildingFactory />}
                    required
                />

                <Select
                    m='xs'
                    icon={<IconUser />}
                    required
                    onChange={e => setOperator(e)}
                    value={operator}
                    radius='md'
                    placeholder="Select operator"
                    data={operatorList.map(operator => ({ value: operator.id, label: operator.name }))}
                    label='Operator'
                />

                <Group grow m='xs' >



                    <NumberInput
                        hideControls
                        icon={<IconArchive />}
                        label='Quantity production'
                        radius='md'
                        required
                        value={quantity}
                        min={0}
                        onChange={(value) => setQuantity(value)}
                        placeholder="input quantity production"
                        rightSection={<Text size='xs' color='dimmed' >Pcs</Text>}

                    />


                    <NumberInput
                        icon={<IconArchive />}
                        hideControls
                        onChange={value => {
                            if (value === undefined) {
                                setQuantityNotGood(0)
                            } else {
                                setQuantityNotGood(value)
                            }
                        }}
                        value={quantityNotGood}
                        min={0}
                        label='Quantity not good'
                        required
                        radius='md'
                        rightSection={<Text size='xs' color='dimmed' >Pcs</Text>}
                        placeholder="input quantity not good of production"

                    />
                </Group>

                {process !== '' &&
                    <Paper m='xl'  >

                        <UnstyledButton>
                            <Group>
                                <IconAsset />
                                <div>
                                    <Text>Material used</Text>
                                </div>
                            </Group>
                        </UnstyledButton>

                        {processList.find(pros => pros.id === parseInt(process)).requirementmaterial_set.map(reqMat => (
                            <Group key={reqMat.id} position="apart" >

                                <Group grow >

                                    <TextInput
                                        radius='md'
                                        label='Material name'
                                        readOnly
                                        value={reqMat.material.name}
                                    />

                                    <TextInput
                                        radius='md'
                                        label='Stock'
                                        readOnly
                                        value={reqMat.material.warehousematerial}
                                    />

                                    <TextInput
                                        radius='md'
                                        label='Qty need'
                                        readOnly
                                        value={quantity === null || quantity === 0 || quantity === undefined ? 0 :
                                            Math.ceil(((quantity + quantityNotGood) / reqMat.output) * reqMat.input)}
                                    />

                                </Group>



                                <ThemeIcon
                                    radius='xl'
                                    mt='md'
                                    color={quantity === null || quantity === 0 || quantity === undefined ? 'blue' :
                                        Math.ceil(((quantity + quantityNotGood) / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? 'red' : 'blue'}
                                >

                                    {quantity === null || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                        Math.ceil(((quantity + quantityNotGood) / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? <IconXboxX /> : <IconCircleCheck />
                                    }

                                </ThemeIcon>

                            </Group>
                        ))}

                        {processList.find(pros => pros.id === parseInt(process)).requirementmaterial_set.length === 0 &&
                            <Text size='sm' align='center' color='dimmed' >
                                This process doesn't have requirement material
                            </Text>
                        }


                    </Paper>


                }

                {process !== '' &&
                    <Paper m='xl'  >
                        <UnstyledButton>
                            <Group>
                                <IconBarcode />
                                <div>
                                    <Text>Product assembly used</Text>
                                </div>
                            </Group>
                        </UnstyledButton>

                        {processList.find(pros => pros.id === parseInt(process)).requirementproduct_set.map(reqProduct => (
                            <Group key={reqProduct.id} spacing='xs' position="apart" >

                                <Group grow >

                                    <TextInput
                                        radius='md'
                                        label='Product name'
                                        readOnly
                                        value={reqProduct.product.name}
                                    />

                                    <TextInput
                                        radius='md'
                                        label='Stock'
                                        readOnly
                                        value={reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity}
                                    />


                                    <TextInput
                                        radius='md'
                                        label='Qty need'
                                        readOnly
                                        value={quantity === null || quantity === 0 || quantity === undefined ? 0 :
                                            Math.ceil(((quantity + quantityNotGood) / reqProduct.output) * reqProduct.input)}
                                    />

                                </Group>



                                <ThemeIcon
                                    radius='xl'
                                    mt='md'
                                    color={quantity === null || quantity === 0 || quantity === undefined ? 'blue' :
                                        Math.ceil(((quantity + quantityNotGood) / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? 'red' : 'blue'}
                                >

                                    {quantity === null || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                        Math.ceil(((quantity + quantityNotGood) / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? <IconXboxX /> : <IconCircleCheck />
                                    }

                                </ThemeIcon>

                            </Group>
                        ))}

                        {processList.find(pros => pros.id === parseInt(process)).requirementproduct_set.length === 0 &&
                            <Text size='sm' align='center' color='dimmed' >
                                This process doesn't have requirement product assembly
                            </Text>
                        }

                    </Paper>


                }

                <Button
                    my='lg'
                    radius='md'
                    fullWidth
                    type="submit"
                    disabled={parseInt(quantity) === 0 || quantity === null || quantity === undefined}
                >
                    Save
                </Button>


            </form>



        </>
    )

}

export default NewProduction
