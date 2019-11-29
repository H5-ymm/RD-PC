import React, { Component } from 'react';
import { Table, Row, Col, Button, Form, Select } from 'antd';
import $axios from '../../axios/$axios';
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

				width: '20%'
			},
			{
				title: '企业名称',
				dataIndex: 'com_name',
				width: '20%'
			},
			{
				title: '登录/注册',
				dataIndex: 'login_date',
				width: '20%'
			},
			{
				title: '手机号',
				dataIndex: 'phone',
				width: '20%'
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
				width: '50'
			},
			{
				title: '操作',
				key: 'action',
				width: '30%',
				render: (text, row) => (
				  <span>
					<a className="actionBtn">审核</a>
					<a className="actionBtn">查看</a>
					<a className="actionBtn">日志</a>
					<a className="actionBtn">删除</a>
					<a className="actionBtn">锁定</a>
					<a className="actionBtn">密码</a>
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
		]
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
			pagination.total = 200;
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

	render() {
		const { selectedRowKeys, loginTime } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange
		};
		const { getFieldDecorator } = this.props.form;
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
							    <Select placeholder="请选择">
									<Option value="企业名称">企业名称</Option>
									<Option value="手机号">手机号</Option>
									<Option value="用户编号">用户编号</Option>
								</Select>
							</FormItem>
							<FormItem label="登录时间:">
							    <Button type="primary">全部</Button>
							    { loginTime.map((item)=>{
								return ( <span className="tag">{item.label}</span>)
								}) }
							</FormItem>
							<FormItem label="注册时间:">
							    <Button type="primary">全部</Button>
								{ loginTime.map((item)=>{
								return ( <span className="tag">{item.label}</span>)
								}) }
								{/* {getFieldDecorator('gender')(
									<Select placeholder="请选择">
										<Option value="企业名称">企业名称</Option>
										<Option value="手机号">手机号</Option>
										<Option value="用户编号">用户编号</Option>
									</Select>
								)} */}
							</FormItem>
							<FormItem label="状态筛选:">
							    <Button type="primary">全部</Button>  
								{/* {getFieldDecorator('gender')(
									<Select placeholder="请选择">
										<Option value="企业名称">企业名称</Option>
										<Option value="手机号">手机号</Option>
										<Option value="用户编号">用户编号</Option>
									</Select>
								)} */}
							</FormItem>
						</Col>
						<Col span={2} style={{ marginRight: '10px', display: 'flex' }} className="serarch-btns">
							<FormItem>
								<Button icon="search" type="primary" htmlType="submit" className={'btn'} onClick={this.handleSearch}>
									搜索
								</Button>
							</FormItem>
							<FormItem>
								<Button className={'btn'} onClick={this.handleReset}>
									重置
								</Button>
							</FormItem>
						</Col>
					</Row>
				</Form>
				<Table columns={this.state.columns} dataSource={this.state.data} loading={this.state.loading} pagination={paginationProps} rowKey={record => record.id} rowSelection={rowSelection} />
			</div>
		);
	}
}

export default Form.create()(TableSearch);
