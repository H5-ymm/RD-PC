import React, { Component } from 'react';
import { Table, Row, Col, Button, Form, Select, Popconfirm,Icon } from 'antd';
import $axios from '../../axios/$axios';
// import CompanyForm from '../../components/CompanyForm';
import { withRouter, Link } from 'react-router-dom';
const FormItem = Form.Item;
const { Option } = Select;

class TableSearch extends Component {
	state = {
		data: [],
		pagination: {
			pageSize: 10,
			current: 1
		},
		loading: false,
		selectedRowKeys: [],
		columns: [
			{
				title: '用户编号',
				dataIndex: 'id',
        width: '12%',
        align: 'center'
			},
			{
				title: '企业名称',
				dataIndex: 'com_name',
        width: '20%',
        align: 'center'
			},
			{
				title: '登录/注册',
				dataIndex: 'login_date',
        width: '20%',
        align: 'center'
			},
			{
				title: '手机号',
				dataIndex: 'phone',
        width: '20%',
        align: 'center'
			},
			// {
			// 	title: '发单职位',
			// 	dataIndex: 'name',
			// 	sorter: true,
			// 	width: '20%'
			// },
			// {
			// 	title: '拼团职位',
			// 	dataIndex: 'name',
			// 	width: '20%'
			// },
			// {
			// 	title: '赏金职位',
			// 	dataIndex: 'name',
			// 	width: '20%'
			// },
			// {
			// 	title: '认证信息',
			// 	dataIndex: 'email'
			// },
			{
				title: '状态',
				dataIndex: 'status',
        width: '10%',
        align: 'center',
        render: status => status === 1 ? '待审核': status === 2 ? '已通过': '未通过',
			},
			{
				title: '操作',
				key: 'action',
        width: '30%',
        align: 'center',
				render: (text, row) => (
				  <span>
            <a className="actionBtn">审核</a>
            <Link to={{ pathname: '/form/editor/', query:{ id: row.uid}}} className="actionBtn">查看</Link>
            <a className="actionBtn">日志</a>
            <div>
              <a className="actionBtn">删除</a>
              <a className="actionBtn">锁定</a>
              <a className="actionBtn">密码</a>
            </div>
				   </span>
				  ),
			  },
		],
		loginTime: [
			{label:'今天',value:1},
			{label:'最近三天',value:2},
			{label:'最近七天',value:3},
			{label:'最近半月',value:4},
			{label:'最近一个月',value:5}
		],
		statusList: [
			{label:'待审核',value:1},
			{label:'已通过',value:2},
			{label:'未通过',value:3},
    ],
    visible: false
	};
	componentWillMount() {
		this.fetch();
	}

	componentWillUnmount() {
		// componentWillMount进行异步操作时且在callback中进行了setState操作时，需要在组件卸载时清除state
		this.setState = () => {
			return;
		};
	}
	// 切换分页
	handleTableChange = page => {
		const pager = { ...this.state.pagination };
		pager.current = page;
		this.setState({ pagination: pager }, () => {
			this.fetch({ page: this.state.pagination.current });
		});
	};
	fetch = (params = {}) => {
		this.setState({ loading: true });
		$axios.post('http://tiantianxsg.com:39888/admin.php/company/companyList', { limit: 20, page:1 }).then(data => {
      const pagination = { ...this.state.pagination };
			pagination.total = data.data.data.count;
			this.setState({
				loading: false,
				data: data.data.data.data,
				pagination
			});
		});
	};

	onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
	};
	handleSearch = e => {
		e.preventDefault();
		// this.props.form.validateFields((err, values) => {
		// 	console.log('Received values of form: ', values);
		// 	const { gender } = values;
		// 	if (gender) {
		// 		this.fetch({
		// 			gender,
		// 			page: this.state.pagination.current
		// 		});
		// 	}
		// });
	};
	handleReset = () => {
		this.props.form.resetFields();
		this.fetch();
	};
	onShowSizeChange(current, pageSize) {
		const pagination = { ...this.state.pagination };
		pagination.pageSize = pageSize;
		pagination.current = current;
		this.setState({ pagination }, () => {
			this.fetch({ results: this.state.pagination.pageSize, page: this.state.pagination.current });
		});
  }
  selectRow = record => {
		const selectedRowKeys = [...this.state.selectedRowKeys];
		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
		} else {
			selectedRowKeys.push(record.key);
		}
		this.setState({ selectedRowKeys });
  };
  // 编辑
	handleEdit(row) {
    console.log(row)
    sessionStorage.setItem('companyInfo',JSON.stringify(row))
    console.log(this.props)
    this.props.history.push('/form/editor');
    // this.props.history.push('/form/basic');
		// this.setState({ currentRow: row, visible: true, id: row.id });
	};
  handleOk = () => {
		this.setState({ visible: false });
	};
  handleSubmit = e => {
		e.preventDefault()
	};
	render() {
		const { selectedRowKeys, loginTime, statusList } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange
		};
		const paginationProps = {
			onChange: page => this.handleTableChange(page),
			onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize), //  pageSize 变化的回调
			...this.state.pagination,
			showSizeChanger: true,
			showQuickJumper: true
		};
		return (
			<div className="shadow-radius">
				<Form className="search-form" style={{ paddingBottom: 0 }}>
					<Row gutter={24}>
						<Col>
							<FormItem label="搜索类型:">
							    <Select placeholder="请选择" style={{ width: '200px' }}>
                    <Option value="企业名称">企业名称</Option>
                    <Option value="手机号">手机号</Option>
                    <Option value="用户编号">用户编号</Option>
								  </Select>
							</FormItem>
							<FormItem label="登录时间:">
							    <Button type="primary">全部</Button>
							    { loginTime.map((item)=>{
								return ( <span className="tag" key={item.label}>{item.label}</span>)
								}) }
							</FormItem>
							<FormItem label="注册时间:">
							    <Button type="primary">全部</Button>
								{ loginTime.map((item)=>{
								return ( <span className="tag" key={item.label}>{item.label}</span>)
								}) }
							</FormItem>
							<FormItem label="状态筛选:">
							    <Button type="primary">全部</Button>
                  { statusList.map((item)=>{
								return ( <span className="tag" key={item.label}>{item.label}</span>)
								}) }
							</FormItem>
						</Col>
						<Col span={2} offset={1} style={{ marginRight: '10px', display: 'flex' }} className="serarch-btns">
							<FormItem>
								<Button type="primary" htmlType="submit" className={'btn'} onClick={this.handleSearch}>
									审核
								</Button>
							</FormItem>
							<FormItem>
                <Popconfirm title="你确定要删除吗？" 
                icon={<Icon type="close-circle"/>} okText="确定" cancelText="取消">
                  <Button className={'btn'}>
                    删除
                  </Button>
                </Popconfirm>
								{/* <Button className={'btn'} onClick={this.handleReset}>
									删除
								</Button> */}
							</FormItem>
              <FormItem>
								<Button className={'btn'} onClick={this.handleReset}>
									锁定
								</Button>
							</FormItem>
						</Col>
					</Row>
				</Form>
        <Table 
          columns={this.state.columns} 
          dataSource={this.state.data} 
          loading={this.state.loading} 
          pagination={paginationProps} 
          rowKey={record => record.id} 
          rowSelection={rowSelection}
          onRow={record => ({
          onClick: () => {
            this.selectRow(record);
          }
          })} />
			  {/* <Modal title="新增/修改管理员" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleOk} footer={null}>
					<CompanyForm data={this.state.currentRow} handleSubmit={this.handleSubmit} handleCancel={this.handleOk} visible={this.state.visible} wrappedComponentRef={form => (this.formRef = form)}  />
				</Modal> */}
      </div>
		);
	}
}

export default Form.create()(withRouter(TableSearch));
