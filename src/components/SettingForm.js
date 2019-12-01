import React, { Component } from 'react';
import { Form, Input, Button, Icon, Upload, TimePicker, Switch, message } from 'antd';
import { uploadFile } from '../api/setting';
import moment from 'moment';
const { TextArea } = Input;
const format = 'HH:mm';
class SettingForm extends Component {
	state = {
		value: 1,
    name: '',
    fileList: [],
    imageUrl: '',
    loading: false,
    submitLoading: false,
    logoUrl: '',
    startTime: '09:00',
		endTime: '17:00'
	}
	componentWillReceiveProps(nextProps) {
		!nextProps.visible && this.props.form.resetFields();
  };
  constructor(props) {
		super(props)
		this.fileInputEl = React.createRef();
	}
	handlePhoto = async (event) => {
    const files = [...event.target.files];
    console.log(files)
    let formFile = new FormData()
    formFile.append('image', files[0]); //加入文件对象
    uploadFile(formFile).then(res => {
      // this.setState({
      //  logoUrl: res.data.url
      // })
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
	render() {
		const { getFieldDecorator } = this.props.form
        const { data } = this.props || null
		const formItemLayout = {
			labelCol: {
				sm: { span: 3 }
			},
			wrapperCol: {
				sm: { span: 8 }
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
        border:'1px solid #d9d9d9',
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
	const { startTime, endTime } = this.state
	let imageUrl = this.state.imageUrl
	if (data.weblogo) {
		imageUrl = 'http://tiantianxsg.com:39888/' + data.weblogo
	}
    console.log(imageUrl)
		return (
			<Form {...formItemLayout} refs="settingForm" onSubmit={this.handleSubmit} labelAlign="left" className="base-form">
					<Form.Item label="网站名称">
						{getFieldDecorator('webname', {
							initialValue: data ? data.webname : '',
						})(<Input placeholder="请输入网站名称"/>)}

						<span className="text"> <Icon type="info-circle" /> 如：便利聘人才网</span>
					</Form.Item>
          <Form.Item label="网站LOGO">  
            <input
              type="file"
              ref={this.fileInputEl}	//挂载ref
              accept=".jpg,.jpeg,.png"	//限制文件类型
              hidden	//隐藏input
              onChange={(event) => this.handlePhoto(event)}		
            />
            <span onClick={() => {
              this.fileInputEl.current.click()		//当点击a标签的时候触发事件
             }}
              //自己看心情改样式吧
            >{imageUrl ? <img src={imageUrl} alt="avatar" className="logoImg" /> : uploadButton}
            </span>
					</Form.Item>
           
					{/* <Form.Item label="网站LOGO" >
					   <Upload
							{...this.getPdfURL()}
							className="avatar-uploader"
							fileList={this.state.fileList}
							showUploadList={false}
							>
							{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
						</Upload>
					</Form.Item> */}
					<Form.Item label="网站地址：">
					   {getFieldDecorator('weburl', {
							initialValue: data ? data.weburl : '',
						})(<Input placeholder="请输入网站地址"/>)}
					</Form.Item>
					<Form.Item label="网站关闭原因" >
					    {getFieldDecorator('offreason', {
							initialValue: data ? data.offreason : '',
						})(<TextArea rows={4} placeholder="请输入网站关闭原因" />)}			
					</Form.Item>
					<Form.Item label="网站开启：" >
				     	{getFieldDecorator('is_open', {
							initialValue: data ? data.is_open == 1 : false,
							valuePropName: 'checked',
						})(<Switch checkedChildren="开启" unCheckedChildren="关闭"  /> )}	 			   
					</Form.Item>
					<Form.Item label="网站版权信息" >
					    {getFieldDecorator('CopyrightInfo', {
							initialValue: data ? data.CopyrightInfo : '',
						})(<Input placeholder="请输入网站版权信息"/>)}			   
					</Form.Item>
					<Form.Item label="站长EMAIL">
					    {getFieldDecorator('owenerEmail', {
							initialValue: data ? data.owenerEmail : '',
						})(<Input placeholder="请输入站长EMAIL"/>)}
					</Form.Item>
					<Form.Item label="站长电话:">
					    {getFieldDecorator('owenerTel', {
							initialValue: data ? data.owenerTel : '',
						})(<Input placeholder="请输入站长电话"/>)}
					</Form.Item>
					<Form.Item label="备案号:">
					    {getFieldDecorator('recordNumber', {
							initialValue: data ? data.recordNumber : '',
						})(<Input placeholder="请输入备案号"/>)}
					</Form.Item>
					<Form.Item label="客服电话:">
					   {getFieldDecorator('customerTel', {
							initialValue: data ? data.customerTel : '',
						})(<Input placeholder="请输入客服电话"/>)}
					   <span className="text"> <Icon type="info-circle" /> 如：400-8888-8888</span>
					</Form.Item>
					<Form.Item label="工作时间:" >
            <TimePicker format={format}  
            onChange={this.onChangeTime}
            value={moment(startTime, format)}></TimePicker>- 
            <TimePicker  value={moment(endTime, format)}  onChange={this.onChangeEndTime} format={format} />
						<span className="text"> <Icon type="info-circle" /> 如：8:00-17:00</span>
					</Form.Item>
					<Form.Item label="客服QQ"  >
					    {getFieldDecorator('customerQQ', {
							initialValue: data ? data.customerQQ : '',
						})(<Input placeholder="请输入客服QQ"/>)}
					   <span className="text"> <Icon type="info-circle" /> 多个则用; 隔开</span>
					</Form.Item>
					<Form.Item label="公司地址:" >
					    {getFieldDecorator('address', {
							initialValue: data ? data.address : '',
						})(<Input placeholder="请输入公司地址"/>)}
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button onClick={this.props.handleSubmit}className="save-btn">
							保存
						</Button>

						<Button type="primary"  >
							取消
						</Button>
					</Form.Item>
				</Form>
		);
	}
}
export default Form.create()(SettingForm);
