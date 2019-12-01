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
				render: (text, row) => (
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
				<a>Invite {record.name}</a>
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
			this.fetch({ page: this.state.pagination.current, limit:20});
		});
	};
	fetch = (params) => {
		this.setState({ loading: true });
		$axios.post('http://tiantianxsg.com:39888/admin.php/user/userList', params).then(data => {
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
		this.setState({ currentRow: row, visible: true, id: row.id });
	}
	// 删除
	handleDel(row) {
    let _this = this
		confirm({
			title: '温馨提示',
			content: '确定要删除当前内容吗？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
        _this.deleteUser(row.id)
			},
			onCancel() {}
		});
  }
  deleteUser = (uid) => {
    $axios.post(`http://tiantianxsg.com:39888/admin.php/user/deleteUser?uid=${uid}`).then(data => {
      if (data.status === 200) {
        this.fetch({limit: this.state.pagination.pageSize, page: this.state.pagination.current});
      }
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
		this.setState({ currentRow: this.state.currentRow, visible: true , id: ''});
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
			this.fetch({ limit: this.state.pagination.pageSize, page: this.state.pagination.current });
		});
	}
	handleSubmit = e => {
		e.preventDefault();
		let _this = this;
		let url = ''
		if (this.state.id) {
			url = 'http://tiantianxsg.com:39888/admin.php/user/updateUser'
		}
		else {
			url = 'http://tiantianxsg.com:39888/admin.php/user/addUser'
		}
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ visible: false });
				$axios.post(url+`?name=${values.name}&username=${values.username}&password==${values.password}&role_id=${values.id}`).then(data => {
					if (data.data.status.code === 200) {
						_this.fetch({limit: this.state.pagination.pageSize, page: this.state.pagination.current});
          }
          else {
            message.error(data.status.remind)
          }
		    }).catch(error => {
          message.error(error.data.status.remind)
        });
			}
		});
	};
	render() {
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
				  })}
        />
			  <Modal title="新增/修改管理员" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleOk} footer={null}>
					<EditForm data={this.state.currentRow} handleSubmit={this.handleSubmit} handleCancel={this.handleOk} visible={this.state.visible} wrappedComponentRef={form => (this.formRef = form)}  />
				</Modal>
			</div>
		);
	}
}

export default Form.create()(Index);
