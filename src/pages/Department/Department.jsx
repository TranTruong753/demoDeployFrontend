import React, { useState, useEffect } from "react";
import { Space, Tag, Popconfirm, Form, Input, Select, Table, Drawer, Button } from "antd";
import { Pencil, Trash2, Plus } from "lucide-react";
import Search from "@/components/Search";
import ModalDepartment from "@/components/modal/Modal";
import FormDepartment from "@/components/form/Form";
import PageHeader from "@/components/PageHeader";
import ButtonIcon from "@/components/ButtonIcon";
import { departmentGetAPI, departmentPostAPI, departmentPutAPI, departmentDeleteAPI, employeeGetAPI } from "@/Services/DepartmentService";
import useWebSocket from "../../Services/useWebSocket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// Đường dẫn
const itemsBreadcrumb = [
    {
        title: <Link to="/">Trang chủ</Link>,
    },

    {
        title: "Phòng ban",
    },
];



const Department = () => {
    const [data, setData] = useState([]);
    const [employeess, setemployeess] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [form] = Form.useForm();
    const [title, setTitle] = useState("");
    const [mode, setMode] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const departmentUpdate = useWebSocket("ws://127.0.0.1:8000/ws/departments/");

    const { data: dataemployeess } = useQuery({
        queryKey: ["employeess"],
        queryFn: employeeGetAPI,
    });

    useEffect(() => {
        setemployeess(dataemployeess || []);
    }, [dataemployeess]);

    const queryClient = useQueryClient();
    const { data: dataDepartment, isLoading } = useQuery({
        queryKey: ["departmentDe"],
        queryFn: departmentGetAPI,
    });
    useEffect(() => {
        if (departmentUpdate) {
            queryClient.invalidateQueries(["departmentDe"]);
        }
    }, [departmentUpdate, queryClient]);
    const { data: dataDepartmentPut, mutate: mutatePut } = useMutation({
        mutationFn: departmentPutAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departmentDe"],
            });
        },
    });
    //thêm nv
    const { data: newData, mutate: mutatePost } = useMutation({
        mutationFn: departmentPostAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departmentDe"],
            });
        },
    });
    function setDataDepartments(departments) {
        return departments?.map((dept) => ({
            key: dept.id,
            name: dept.name,
            manager: dept.manager ? dept.manager.name : "Chưa có trưởng phòng",
            description: dept.description ? dept.description : "Không có mô tả phòng ban",
        }));
    }
    useEffect(() => {
        //console.log("fix de", dataDepartment);
        if (dataDepartment) {
            setData(setDataDepartments(dataDepartment.results));
        }
    }, [dataDepartment]);
    useEffect(() => {
        if (selectedDepartment) form.setFieldsValue(selectedDepartment);
    }, [form, selectedDepartment]);

    const handleEditDepartment = (record) => {
        setTitle("Sửa Phòng Ban");
        setSelectedDepartment(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
        setMode("Edit");
    };

    const handleDeleteDepartment = async (id) => {
        await departmentDeleteAPI(id);
        setData((prevData) => prevData.filter((item) => item.key !== id));
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                manager: !values.manager || values.manager === "Chưa có trưởng phòng" ? null : values.manager,
            };

            console.log("Payload gửi đi:", payload);

            if (mode === "Edit") {
                mutatePut({ id: selectedDepartment.key, obj: payload });
            } else {
                mutatePost(payload);
            }
        } catch (error) {
            console.error("Lỗi xác thực form:", error);
        }
        setIsModalOpen(false);
    };

    const onChange = (page) => {
        // console.log(page);
        // setCurrent(page);
    };

    // tùy chỉnh form kích thước input
    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const formItems = [
        {
            name: "name",
            label: "Tên Phòng Ban",
            component: <Input placeholder="Hãy nhập tên phòng ban" />,
            rules: [{ required: true, message: "Làm ơn nhập tên phòng ban" }],
        },
        {
            name: "manager",
            label: "Trưởng Phòng",
            component: (
                <Select
                    placeholder="Chọn trưởng phòng"
                    allowClear
                >
                    {employeess.map((emp) => (
                        <Select.Option
                            key={emp.id}
                            value={emp.id}
                        >
                            {emp.name}
                        </Select.Option>
                    ))}
                </Select>
            ),
            hidden: mode === "Add" ? true : false,
        },
        {
            name: "description",
            label: "Mô tả",
            component: <Input placeholder="Mô tả phòng ban" />,
            rules: [{ required: false, message: "Hãy mô tả phòng ban" }],
        },
    ];

    const columns = [
        {
            title: "ID",
            dataIndex: "key",
            key: "key",

        },
        {
            title: "Tên Phòng Ban",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    {/* Tùy chỉnh dropdown filter */}
                    <Input
                        autoFocus
                        placeholder="Tìm kiếm theo tên phòng ban"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => clearFilters && clearFilters()}
                        >
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => confirm()}
                        >
                            Tìm
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()), // So sánh không phân biệt hoa/thường
            filterSearch: true,
        },
        { 
            title: "Trưởng Phòng", 
            dataIndex: "manager", 
            key: "manager" ,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    {/* Tùy chỉnh dropdown filter */}
                    <Input
                        autoFocus
                        placeholder="Tìm kiếm theo tên"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => clearFilters && clearFilters()}
                        >
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => confirm()}
                        >
                            Tìm
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => record.manager.toLowerCase().includes(value.toLowerCase()), // So sánh không phân biệt hoa/thường
            filterSearch: true,
            
        },
        { title: "Mô tả", dataIndex: "description", key: "description" },
        // { title: 'Trạng Thái', dataIndex: 'is_deleted', key: 'is_deleted', render: (text) => <Tag color={text === "Ngừng hoạt động" ? "volcano" : "green"}>{text}</Tag> },
        {
            title: "Hành Động",
            key: "action",
            render: (_, record) => (
                <Space>
                    {/* <a onClick={() => handleEditDepartment(record)}>
                        <Pencil size={20} />
                    </a> */}
                    <Button
                        shape="circle"
                        size="medium"
                        color="gold"
                        variant="solid"
                        onClick={() => handleEditDepartment(record)}

                    >
                        <Pencil size={18} />
                    </Button>
                    <Popconfirm
                        title="Xóa phòng ban?"
                        onConfirm={() => handleDeleteDepartment(record.key)}
                        okText="Có"
                        cancelText="Không"
                        description="Bạn đã chắc chắn muốn xóa ?"
                    >
                        <Button
                            shape="circle"
                            size="medium"
                            color="red"
                            variant="solid"

                        >
                            <Trash2 size={18} />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <PageHeader title={"Quản lý Phòng Ban"} itemsBreadcrumb={itemsBreadcrumb}>
                <ButtonIcon
                    handleEvent={() => {
                        form.resetFields();
                        setTitle("Thêm Phòng Ban");
                        setMode("Add");
                        setIsModalOpen(true);
                    }}
                >
                    <Plus /> Thêm Phòng Ban Mới
                </ButtonIcon>
            </PageHeader>

            <div className="mt-5">
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        total: total,
                        defaultCurrent: current,
                        pageSize: 5, // Mặc định 10 dòng mỗi trang
                        onChange: onChange,
                    }}
                    isLoading={isLoading}
                />
            </div>
            <ModalDepartment
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={() => setIsModalOpen(false)}
                title={title}
                form={form}
            >
                <FormDepartment
                    form={form}
                    formItems={formItems}
                    formItemLayout={formItemLayout}
                />
            </ModalDepartment>
        </>
    );
};

export default Department;
