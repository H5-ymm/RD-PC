import React, { Component } from 'react';
import { Table, Row, Col, Button, Form, Select, Popconfirm, Icon, Popover, Radio,Input, Modal, Timeline, message } from 'antd';
import $axios from '../../axios/$axios';
import { getCompanyList, companyCheck, companyLock, companyLog, companyDel, resetPassword } from '../../api/company'
// import CompanyForm from '../../components/CompanyForm';
import { withRouter, Link } from 'react-router-dom';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
// const { confirm } = Modal;
class TableSearch extends Component {
	state = {
		data: [],
		pagination: {
			pageSize: 10,
			current: 1
    },
    params: {
      limit: 10,
      page:1
    },
		loading: false,
		selectedRowKeys: [],
		columns: [
			{
				title: '用户编号',
				dataIndex: 'uid',
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
            <a className="actionBtn" onClick={() => this.handleCheck(row)} >审核</a>
            <Link to={{ pathname: '/form/editor/', query:{ id: row.uid}}} className="actionBtn">查看</Link>
            <a className="actionBtn" onClick={() => this.watchLog(row)}>日志</a>
          
            <div>
              <a className="actionBtn" onClick={() => this.handleDel(row)}>删除</a>
              <a className="actionBtn" onClick={() => this.handleLock(row)}>锁定</a>
              <a className="actionBtn" onClick={() => this.handlePassword(row)}>密码</a>
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
    visible: false,
    visibleCheck: false,
    visibleLock: false,
    visibleDel:false,
    visiblePassword:false,
		status: 2,
    reason: '',
    checkObj: {},
    logList: [],
    lockObj: {},
    statusLock: 0,
    reasonLock: '',
    uid: '',
    queryType: 1,
    query: {}
	};
	componentWillMount() {
		this.fetch(this.state.params);
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
		this.setState({ params: {
      page : pager
    }}, () => {
			this.fetch(this.state.params);
		});
	};
	fetch = (params) => {
    console.log(params)
		this.setState({ loading: true });
		getCompanyList(params).then(res => {
      console.log(res)
      const pagination = { ...this.state.pagination };
			pagination.total = res.data.count;
			this.setState({
				loading: false,
				data: res.data.data,
				pagination
			});
		});
	};

	onSelectedRowKeysChange = selectedRowKeys => {
    console.log(selectedRowKeys)
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
		// this.fetch();/
	};
	watchLog(row) {
		this.setState({visible: true})
		companyLog({uid: row.uid}).then(res =>{
      this.setState({
        logList: res.data
      })
		})
  }
  handleDel(row,flag){
    console.log(flag)
    if (!row) {
      if (!this.state.selectedRowKeys.length) {
        return message.error('请选择企业')
      }
      let uids = this.state.selectedRowKeys.join(',')
      this.setState({visibleDel: true,uid: uids})
    }
    else {
      this.setState({visibleDel: true,uid:row.uid})
    }
    // this.setState({visibleDel: true,uid:row.uid})
  }
	handleCheck(row,index){
    if (index) {
      if (!this.state.selectedRowKeys.length) {
        return message.error('请选择企业')
      }
      let uids = this.state.selectedRowKeys.join(',')
      this.setState({visibleCheck: true,uid: uids, status: 2})
    }
   else {
    this.setState({visibleCheck: true,uid:row.uid})
   }
  }
  handlePassword(row){
    this.setState({visiblePassword: true,uid:row.uid})
  }
  comfirmCheck = () => {
    let params = {
			uid: this.state.uid,
			status: this.state.status,
			reason: this.state.reason
		}
    companyCheck(params).then(res =>{
      message.success('操作成功')
      this.fetch(this.state.params)
      this.setState({visibleCheck: false})
	  }).catch(error=>{
      message.error(error.status.remind)
    })
    
  }
  comfirmPassword =() => {
    let params = {
			uid: this.state.uid,
		}
    resetPassword(params).then(res =>{
      message.success('操作成功')
      this.fetch(this.state.params)
	  }).catch(error=>{
      message.error(error.status.remind)
    })
    this.setState({visiblePassword: false})
  }
  comfirmDel= () => {
    let params = {
			uids: this.state.uid
		}
    companyDel(params).then(res =>{
      message.success('操作成功')
      this.fetch(this.state.params)
      this.setState({visibleDel: false})
	  }).catch(error=>{
      message.error(error.status.remind)
    })
  }
  onChange = e => {
    const { value } = e.target;
    if ( value === '' ) {
      this.props.onChange(value);
    }
    this.setState({status: value });
  };
  onChangeInput = e => {
    const { value } = e.target;
    if ( value === '' ) {
      this.props.onChange(value);
    }
    this.setState({reason: value });
  };
  onChangeLock = e => {
    const { value } = e.target;
    if ( value === '' ) {
      this.props.onChange(value);
    }
    this.setState({reasonLock: value });
  };
  onChangeLockStatus = e => {
    const { value } = e.target;
    if ( value === '' ) {
      this.props.onChange(value);
    }
    this.setState({statusLock: value });
  };
  handleLock(row){
    this.setState({visibleLock: true,uid: row.uid,statusLock:row.is_lock})
  }
  comfirmLock = () => {
    let params = {
			uid: this.state.uid,
			status: this.state.statusLock,
			reason: this.state.reasonLock
		}
    companyLock(params).then(res =>{
      message.success('操作成功')
      this.fetch(this.state.params)
      this.setState({visibleLock: false})
	  }).catch(error=>{
      message.error(error.status.remind)
    })
  }
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
  handleOk = () => {
		this.setState({ visible: false });
	};
  handleSubmit = e => {
		e.preventDefault()
  };
  queryInput = e => {
    const { value } =  e.target
    let obj = {}
    if (this.state.queryType ==1) {
      obj.com_name = value
    }
    else if (this.state.queryType ==2) {
      obj.telphone = value
    }
    if (this.state.queryType ==1) {
      obj.id = value
    }
    this.setState({
      query: obj
    })
  }
  selectType = value => {
    this.setState({
      queryType: value
    })
  };
  query(row){
    let newObj = Object.assign(this.state.query,this.state.params)
    this.fetch(newObj)
  };
  queryLogin(row,) {
    let obj = {}
    if (row) {
      obj.login_data = row.value
    }
    let newObj = Object.assign(obj,this.state.params)
    this.fetch(newObj)
  };
  queryRegister(row) {
    let obj = {}
    if (row) {
      obj.reg_date = row.value
    }
    let newObj = Object.assign(obj,this.state.params)
    this.fetch(newObj)
  };
  queryStatus(row) {
    let obj = {}
    if (row) {
      obj.status = row.value
    }
    let newObj = Object.assign(obj,this.state.params)
    this.fetch(newObj)
  };
	render() {
		const { selectedRowKeys, loginTime, statusList, p } = this.state;
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
							    <Select placeholder="请选择" onChange={this.queryType} style={{ width: '200px' }} >
                    <Option value="1">企业名称</Option>
                    <Option value="2">手机号</Option>
                    <Option value="3">用户编号</Option>
								  </Select>
                  <Input placeholder="请输入" style={{ width: '200px',margin:'0 10px' }} />
                  <Button type="primary" onClick={this.query.bind(this)}>查询</Button>
							</FormItem>
							<FormItem label="登录时间:">
							    <Button type="primary" onClick={this.queryLogin.bind(this,0)}>全部</Button>
							    { loginTime.map((item)=>{
								return ( <span className="tag" onClick={this.queryLogin.bind(this,item)} key={item.label}>{item.label}</span>)
								}) }
							</FormItem>
							<FormItem label="注册时间:">
							    <Button type="primary" onClick={this.queryRegister.bind(this,0)}>全部</Button>
								{ loginTime.map((item)=>{
								return ( <span className="tag"  onClick={this.queryRegister.bind(this,item)} key={item.label}>{item.label}</span>)
								}) }
							</FormItem>
							<FormItem label="状态筛选:">
							    <Button type="primary" onClick={this.queryStatus.bind(this,0)}>全部</Button>
                                { statusList.map((item)=>{
								 return ( <span className="tag" onClick={this.queryStatus.bind(this,item)} key={item.label}>{item.label}</span>)
								}) }
							</FormItem>
						</Col>
						<Col span={2} offset={1} style={{ marginRight: '10px', display: 'flex' }} className="serarch-btns">
							<FormItem>
									<Button type="primary"  className={'btn'} onClick={this.handleCheck.bind(this,2)}>
                    审核
									</Button>
							</FormItem>
							<FormItem>
                 <Button className={'btn'} onClick={this.handleDel.bind(this,0)}>
										删除
									</Button>
							</FormItem>
						  <FormItem>
								<Button className={'btn'} onClick={this.handleLock}>锁定</Button>
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
        <Modal
          title="审核"
          cancelText="取消"
          okText="确认"		
          visible={this.state.visibleCheck}
          onOk={this.comfirmCheck}
          onCancel={()=> this.setState({visibleCheck:false})}
		    	>
          <div style={{width:'300px'}}>
            <p>审核结果</p>
            <Radio.Group onChangeonChange={this.onChange} defaultValue={this.state.status}>
              <Radio value={2}>通过</Radio>
              <Radio value={3}>未通过</Radio>
            </Radio.Group>
            <p style={{marginTop:'10px'}}>说明</p>
            <TextArea rows={4} placeholder="请输入" onChange={this.onChangeInput} />
          </div>	
		    </Modal>
        <Modal
          title=""
          cancelText="取消"
          okText="确认"		
          visible={this.state.visibleDel}
          onOk={this.comfirmDel}
          onCancel={()=> this.setState({visibleDel:false})}
		    	>
          <p>你确定要删除吗？</p>
		    </Modal>
        <Modal
          title="重置密码"
          cancelText="取消"
          okText="确认"		
          visible={this.state.visiblePassword}
          onOk={this.comfirmPassword}
          onCancel={()=> this.setState({visiblePassword:false})}
		    	>
          <p>密码重置:12345，不可逆转，谨慎操作</p>
		    </Modal>   
        <Modal
          title="锁定"
          cancelText="取消"
          okText="确认"		
          visible={this.state.visibleLock}
          onOk={this.comfirmLock}
          onCancel={()=>this.setState({visibleLock:false})}
		    	>
         	<div style={{width:'300px'}}>
            <p>锁定说明</p>
            <Radio.Group onChange={this.onChangeLockStatus} defaultValue={this.state.statusLock}>
              <Radio value={1}>锁定</Radio>
              <Radio value={0}>已锁定</Radio>
            </Radio.Group>
            <p style={{marginTop:'10px'}}>锁定说明</p>
            <TextArea rows={4} placeholder="请输入网站关闭原因" onChange={this.onChangeLock}/>
		    	</div>
		 </Modal>   
		 <Modal
			title="日志"
			visible={this.state.visible}
			onOk={()=>this.setState({visible:false})}
			onCancel={()=>this.setState({visible:false})}
			footer={null}
			>
			<Timeline>
				{
				  this.state.logList.map(item => {
					return (<Timeline.Item key={item.id} >
				        <p>{item.ctime}</p>
						<p>{item.content}</p>
					</Timeline.Item>)
				  })
				}
			</Timeline>
			<div style={{'textAlign': "right"}}>
			  <Button type="primary" onClick={()=> this.setState({visible:false})} >关闭</Button>
			</div>	
		</Modal>
      </div>
		);
	}
}

export default Form.create()(withRouter(TableSearch));
