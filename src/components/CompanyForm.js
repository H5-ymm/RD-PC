import React, { Component } from 'react';
import { Form, Input, Button, Icon, Col, Row, message, Select,  confirm, Modal } from 'antd';
import { uploadFile } from '../api/setting';
import moment from 'moment';
import { getProvincesList, getCitysList, getAreasList, resetPassword } from '../api/company'
const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;
const format = 'HH:mm';
class CompanyForm extends Component {
	state = {
		value: 1,
    name: '',
    fileList: [],
    imageUrl: '',
    loading: false,
    submitLoading: false,
    logoUrl: '',
    provinceList: [],
    cityList: [],
    areaList: [],
    province: '',
    city:'',
    area: ''  ,
    visible: false,
    uid:'',
    license_url: ''
	}
	componentWillReceiveProps(nextProps) {
		!nextProps.visible && this.props.form.resetFields();
  };
  constructor(props) {
		super(props)
    this.fileInputEl = React.createRef();
  }
  getRegion() {
    getProvincesList().then(res=>{
      this.setState({
        provinceList: res.data
      })
    })
  };
  getCityList(code){
      if (!code) {
        code = '110000'
      }
      getCitysList({code}).then(res =>{
        this.setState({
          cityList: res.data
        })
      })
  };
  getAreaList(code) {
    if (!code) {
      code = '110100'
    }
    getAreasList({code}).then(res =>{
      this.setState({
        areaList: res.data
      })
    })
  };
  componentWillMount() {
    this.getRegion()
    this.getCityList()
    this.getAreaList()
  }
	handlePhoto = async (event) => {
    const files = [...event.target.files];
    let formFile = new FormData()
    formFile.append('image', files[0]); //加入文件对象
    uploadFile(formFile).then(res => {
      this.props.getLogoImg(res.data.url)
    })
    if (files.length === 0) return;
		await this.setState({ submitLoading: true })
		let result = await Promise.all(
			files.map(file => {
				let url = null;
				if (window.createObjectURL != undefined) {
					url = window.createObjectURL(file)
				} else if (window.URL != undefined) {
					url = window.URL.createObjectURL(file)
				} else if (window.webkitURL != undefined) {
					url = window.webkitURL.createObjectURL(file)
				}
				return url;
			})
    );
    this.setState({
      imageUrl: result
    })
  }
  handlePhotoCom = async (event) => {
    const files = [...event.target.files];
    let formFile = new FormData()
    formFile.append('image', files[0]); //加入文件对象
    uploadFile(formFile).then(res => {
      this.props.getComImg(res.data.url)
    })
    if (files.length === 0) return;
		await this.setState({ submitLoading: true })
		let result = await Promise.all(
			files.map(file => {
				let url = null;
				if (window.createObjectURL != undefined) {
					url = window.createObjectURL(file)
				} else if (window.URL != undefined) {
					url = window.URL.createObjectURL(file)
				} else if (window.webkitURL != undefined) {
					url = window.webkitURL.createObjectURL(file)
				}
				return url;
			})
    );
    this.setState({
      license_url: result
    })
  }
  onChangeTime = time =>{
    this.setState({
      startTime: moment(time, format)
    })
    this.props.getStartTime(this.state.endTime)
  };
  onChangeEndTime = time => {
    this.setState({
      endTime: moment(time, format)
    })
    this.props.getTime(this.state.endTime)
  }
  handlePassword = () => {
    this.setState({visible: true})
  }
  handleOk = () =>{
    resetPassword({uid: this.props.data.uid}).then(res => {
      this.handleCancel()
      message.success('密码重置成功')
    }).catch(error => {
      message.error(error.status.remind)
    })
  }
  handleCancel= () =>{
    this.setState({visible: false})
  }
  handleProvince = value => {
    console.log(value)
    this.props.getProvince(value)
  }
  handleCity = value => {
    console.log(value)
    this.props.getCity(value)
  }
  handleArea = value => {
    console.log(value)
    this.props.geArea(value)
  }
  getPhone = e => {
    const { value } = e.target
    console.log(value)
    this.props.getTelphone(value)
  }
  getPhoneLaster = e => {
    const { value } = e.target
    console.log(value)
    this.props.getTelphoneLaster(value)
  }
	render() {
		const { getFieldDecorator } = this.props.form
    const { data } = this.props || null
		const formItemLayout = {
			labelCol: {
				sm: { span: 4 },
			},
			wrapperCol: {
        sm: { span: 10 },
        offset: 1
			}
		};
		const tailFormItemLayout = {
			wrapperCol: {
				sm: {
					span: 9,
					offset: 9
				}
			}
		};
		const uploadButton = (
      <div 
       style={{
        height: '90px',
        display: 'block',
        width:'90px',
        border:'1px dashed #d9d9d9',
        textAlign: 'center'
      }}>
			  <Icon type={this.state.loading ? 'loading' : 'plus' } style={{
          paddingTop: '30px'
        }} />
			  <div style={{
          marginTop: '-15px'
        }}>上传</div>
			</div>
		  );
    let imageUrl = this.state.imageUrl
    let licenseUrl = this.state.license_url
    if (!this.state.imageUrl) {
      imageUrl = 'http://tiantianxsg.com:39888/' + data.logo_url
    }
    if (!this.state.license_url) {
      licenseUrl = 'http://tiantianxsg.com:39888/' + data.license_url
    }
		return (
			<Form {...formItemLayout} refs="companyForm" onSubmit={this.handleSubmit} labelAlign="right" className="base-form">
				<div>
          <p className="company-title">账户信息</p>
          <Form.Item label="账户名称">
            {getFieldDecorator('com_name', {
              initialValue: data ? data.com_name : '',
            })(<Input placeholder="请输入账户名称"/>)}
          </Form.Item>
          <Form.Item label="账户密码">
            <Button type="primary" onClick={this.handlePassword}>重置密码</Button>
              <span> <Icon type="info-circle" />  密码重置:12345，不可逆转，谨慎操作</span>
          </Form.Item>
        </div>
        <div>
          <p className="company-title">基本信息</p>
          <Form.Item label="企业名称">
						{getFieldDecorator('com_name', {
              initialValue: data ? data.com_name : '',
              rules: [
                {
                  required: true,
                  message: '请输入账号'
                }
              ]
						})(<Input placeholder="请输入企业名称"/>)}
					</Form.Item>
          <Form.Item label="企业LOGO">  
            <input
              type="file"
              name="imageUrl"
              ref={this.fileInputEl}	//挂载ref
              accept=".jpg,.jpeg,.png"	//限制文件类型
              hidden	//隐藏input
              onChange={(event) => this.handlePhoto(event)}		
            />
             <a onClick={() => {
                this.fileInputEl.current.click()		//当点击a标签的时候触发事件
              }}
              >{imageUrl ? <img src={imageUrl} alt="avatar" className="logoImg" /> : uploadButton}
            </a>
					</Form.Item>
          <Form.Item label="企业执照上传">  
            <input
              type="file"
              name="licenseUrl"
              ref={this.fileInputEl}	//挂载ref
              accept=".jpg,.jpeg,.png"	//限制文件类型
              hidden	//隐藏input
              onChange={(event) => this.handlePhotoCom(event)}		
            />
             <a onClick={() => {
                this.fileInputEl.current.click()		//当点击a标签的时候触发事件
              }}
              >{licenseUrl ? <img src={licenseUrl} alt="avatar" className="logoImg" /> : uploadButton}
            </a>
					</Form.Item>
					<Form.Item label="企业执照号:">
					   {getFieldDecorator('business_licence', {
							initialValue: data ? data.business_licence : '',
						})(<Input placeholder="请输入企业执照号"/>)}
					</Form.Item>
					<Form.Item label="统一社会信用代码:" >
					    {getFieldDecorator('unified_social_credit_code', {
							initialValue: data ? data.unified_social_credit_code : '',
						})(<Input placeholder="统一社会信用代码"/>)}			   
					</Form.Item>
					<Form.Item label="从事行业:">
					    {getFieldDecorator('com_sort', {
							initialValue: data ? data.com_sort : '',
						})(<Input placeholder="请输入从事行业"/>)}
					</Form.Item>
					<Form.Item label="企业性质:">
					    {getFieldDecorator('com_type', {
							initialValue: data ? data.com_type : '',
						})(<Input placeholder="请输入企业性质"/>)}
					</Form.Item>
					<Form.Item label="企业规模:">
					    {getFieldDecorator('com_scale', {
							initialValue: data ? data.com_scale : '',
						})(<Input placeholder="请输入备案号"/>)}
					</Form.Item>
          <Form.Item label="企业地址:">
					    {/* {getFieldDecorator('email_status', {
							initialValue: data ? data.email_status : '',
						 })( */}
              <Select style={{ width: 120, marginRight:'10px' }} onChange={this.handleProvince.bind(this)} placeholder="请选择">
                {
                  this.state.provinceList.map(item=>{
                    return (
                      <Option value={item.provinceid} key={item.provinceid}>{item.province}</Option>
                    )
                  })
                }
              </Select>
              <Select style={{ width: 120, marginRight:'10px' }} onChange={this.handleCity.bind(this)}  placeholder="请选择">
              {
                this.state.cityList.map(item=>{
                  return (
                    <Option value={item.code} key={item.code}>{item.name}</Option>
                  )
                })
              }
            </Select>
            <Select style={{ width: 120 }} placeholder="请选择" onChange={this.handleArea.bind(this)}>
            {
              this.state.areaList.map(item=>{
                return (
                  <Option value={item.code} key={item.code}>{item.name}</Option>
                )
              })
            }
          </Select>
            {/* )} */}
            <Input placeholder="请输入公司地址" value={data.address} size="large" style={{ marginTop: '10px' }}/>
					</Form.Item>
					<Form.Item label="联系人:">
					   {getFieldDecorator('link_man', {
							initialValue: data ? data.link_man : '',
						})(<Input placeholder="请输入联系人"/>)}
					</Form.Item>
					<Form.Item label="联系电话:"  >
					    {getFieldDecorator('link_phone', {
							initialValue: data ? data.link_phone : '',
						})( <Input placeholder="请输入联系电话"/>)}
					</Form.Item>
					<Form.Item label="公司座机:" >
            <InputGroup >
              <Row gutter={10}>
                <Col span={5}>
                  <Input  placeholder="区号" onChange={this.getPhone.bind(this)}/>
                </Col>
                <Col span={10}>
                  <Input placeholder="座机号码"  onChange={this.getPhoneLaster.bind(this)}/>
                </Col>
              </Row>
             </InputGroup>
            <span className="text" style={{right:0}}> <Icon type="info-circle" />  如：021-8888777</span>
					</Form.Item>
          <Form.Item label="公司简介:" >
					    {getFieldDecorator('content', {
							initialValue: data ? data.content : '',
						})(<TextArea rows={4} placeholder="请输入企业简介" />)}			
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button onClick={this.props.handleSubmit} className="save-btn">
							修改
						</Button>
						<Button type="primary"  >
							取消
						</Button>
					</Form.Item>
        </div>
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.handleOk}
          cancelText="取消"
          okText="确定"
          onCancel={this.handleCancel}
         >
          <p>点击后提示密码重置为123456，确认重置吗？</p>
        </Modal>
			</Form>
		);
	}
}
export default Form.create()(CompanyForm);
