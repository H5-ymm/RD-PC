import React, { Component } from 'react';
import { Table, Alert, Button, Form, Modal, message } from 'antd';
import $axios from '../../axios/$axios';
import EditForm from '../../components/EditForm';
const { confirm } = Modal;
class Index extends Component {
	state = {
		data: [],
		pagination: {
			pageSize: 10,
			current: 1
		},
		total: 0,
		loading: false,
		selectedRowKeys: [],
		text:'提示：根据权限名称不同，可操作功能不同',
		columns: [
			{
				title: '编号',
				dataIndex: 'id',
				width: '20%'
			},
			{
				title: '账号',
				dataIndex: 'name',
				width: '20%'
			},
			{
				title: '权限',
				dataIndex: 'description'
			},
			{
				title: '真实姓名',
				dataIndex: 'username'
			},
			{
				title: '状态',
				dataIndex: 'prohibit'
			},
			{
				title: '操作',
				key: 'action',
				render: (text, row, index) => (
				  <span>
					<a className="actionBtn" onClick={() => this.handleEdit(row)}>修改</a>
					<a onClick={() => this.handleDel(row)}>删除</a>
				  </span>
				),
			  },
		],
		currentRow: null,
		visible: false,
		columnsAction:{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
			  <span>
				<a >Invite {record.name}</a>
				<a>Delete</a>
			  </span>
			),
		  },
		  id: ''
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
		$axios.post('http://tiantianxsg.com:39888/admin.php/user/userList', { page: 1, limit:20 }).then(data => {
			console.log(data.data.data.data)
			const pagination = { ...this.state.pagination };
			pagination.total = data.data.count;
			this.setState({
				loading: false,
				data: data.data.data.data,
				pagination,
				total: data.data.data.count
			});
		});
	};
	// 编辑
	handleEdit(row) {
		console.log(row)
		this.setState({ currentRow: row, visible: true, id: row.id });
	}
	// 删除
	handleDel(row) {
		confirm({
			title: '温馨提示',
			content: '确定要删除当前内容吗？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				message.info('你点击了确定，当前行key为：' + row.key, 1);
			},
			onCancel() {}
		});
	}
	handleOk = () => {
		this.setState({ visible: false });
	};
	onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
	};
	handleSearch = e => {
		e.preventDefault();
		this.setState({ currentRow: this.state.currentRow, visible: true });
	};
	handleReset = () => {
		this.props.form.resetFields();
		this.fetch();
	};
	selectRow = record => {
		const selectedRowKeys = [...this.state.selectedRowKeys];
		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
		} else {
			selectedRowKeys.push(record.key);
		}
		this.setState({ selectedRowKeys });
	};
	onShowSizeChange(current, pageSize) {
		const pagination = { ...this.state.pagination };
		pagination.pageSize = pageSize;
		pagination.current = current;
		this.setState({ pagination }, () => {
			this.fetch({ results: this.state.pagination.pageSize, page: this.state.pagination.current });
		});
	}
	handleSubmit = e => {
		e.preventDefault();
		let _this = this;
		let url = ''
		console.log(this.state.id)
		if (this.state.id) {
			url = 'http://tiantianxsg.com:39888/admin.php/user/updateUser'
		}
		else {
			url = 'http://tiantianxsg.com:39888/admin.php/user/addUser'
		}
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				this.setState({ visible: false });
				$axios.post( `http://tiantianxsg.com:39888/admin.php/user/addUser?name=${values.name}&username=${values.username}&password==${values.password}&role_id=${values.role_id}`).then(data => {
					if (data.status.code ==200) {
						_this.fetch();
					}
					console.log(data.data)
		    });
			}
		});
	};
	render() {
		const { selectedRowKeys } = this.state;
		// const rowSelection = {
		// 	selectedRowKeys,
		// 	onChange: this.onSelectedRowKeysChange
		// };
		const { getFieldDecorator } = this.props.form;
		const paginationProps = {
			onChange: page => this.handleTableChange(page),
			onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize), //  pageSize 变化的回调
			...this.state.pagination,
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共 ${total} 条记录`
		};
		return (
			<div className="shadow-radius">
				<Alert message={this.state.text} type="info" className="message"/>
				<Button type="primary" htmlType="submit" className="add" onClick={this.handleSearch}>添加管理员</Button>
				<Table 
					columns={this.state.columns} 
					dataSource={this.state.data} 
					loading={this.state.loading} 
					pagination={paginationProps} 
					rowKey={record => record.id} 
					onRow={record => ({
						onClick: () => {
							this.selectRow(record);
						}
				})}/>
			    <Modal title="新增/修改管理员" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleOk} footer={null}>
					<EditForm data={this.state.currentRow} handleSubmit={this.handleSubmit} visible={this.state.visible} wrappedComponentRef={form => (this.formRef = form)}  />
				</Modal>
			</div>
		);
	}
}

export default Form.create()(Index);
