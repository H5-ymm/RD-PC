import React from 'react';
import { Form, Input, TimePicker, Switch, Button, Upload, Icon, message  } from 'antd';
import $axios from '../../axios/$axios';
import { changeConfig } from '../../api/setting'
import moment from 'moment';

const { TextArea } = Input;
const format = 'HH:mm';
function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
  }
// const CustomizedForm = Form.create({
// 	name: 'global_state',
// 	onFieldsChange(props, changedFields) {
// 	  props.onChange(changedFields);
// 	},
// 	mapPropsToFields(props) {
// 	  return {
// 		username: Form.createFormField({
// 		  ...props.username,
// 		  value: props.username.value,
// 		}),
// 	  };
// 	},
// 	onValuesChange(_, values) {
// 	  console.log(values);
// 	},
//   })(props => {
// 	const { getFieldDecorator } = props.form;
// 	return (
// 	  <Form layout="inline">
// 		<Form.Item label="Username">
// 		  {getFieldDecorator('username', {
// 			rules: [{ required: true, message: 'Username is required!' }],
// 		  })(<Input />)}
// 		</Form.Item>
// 	  </Form>
// 	);
// });
class BasicForm extends React.Component {
	state = {
		confirmDirty: false,
		loading: false,
		basicForm: {
			webname: '',
			address: '',
			CopyrightInfo: '',
			customerQQ: '',
			customerTel: '',
			offreason: '',
			is_open: '',
			owenerEmail: '',
			owenerTel: '',
			weblogo: '',
			weburl: '',
			workTime: '',
			recordNumber: ''
		},
		startTime: '09:00',
		endTime: '17:00',
		id: '',
		fileList: []
	};
	onFieldsChange(props, changedFields) {
		props.onChange(changedFields);
	  }
	mapPropsToFields(props) {
		console.log(props)
		return {
		  username: Form.createFormField({
			...props.username,
			value: props.username.value,
		  }),
		};
	}
	handleChange = info => {
		if (info.file.status === 'uploading') {
		  this.setState({ loading: true });
		  return;
		}
		if (info.file.status === 'done') {
		  // Get this url from response in real world.
		  getBase64(info.file.originFileObj, imageUrl =>
			this.setState({
			  imageUrl,
			  loading: false,
			}),
		  );
		}
	};
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.weblogo = this.state.image || 'http://dd.png'
				values.is_open = values.is_open ? 1 : 0
				values.workTime = this.state.startTime + '-' +  this.state.endTime
				values.id = this.state.id
				changeConfig(values).then(res => {
					if (res.status.code === 200) {
						message.success('保存成功');
					}	
				})
			}
		});
	};

	handleConfirmBlur = e => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};
	componentWillMount() {
	  this.fetch();
	};
	fetch = () => {
		this.setState({ loading: true });
		$axios.post('http://tiantianxsg.com:39888/admin.php/config/getConfig', { }).then(data => {
			this.props = data.data.data
			this.setState({
				basicForm: data.data.data,
				id: data.data.data.id
			})
		});
	};
	getPdfURL = () =>{
		const props = {
			name: 'file',
			action: 'http://tiantianxsg.com:39888/index.php/uploadimg/moreupload',
			headers: {
			  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
			},
			data:{
				image: this.state.fileList
			},
			listType: 'picture-card',
			onChange(info) {//上传文件改变时的状态
				if (info.file.status !== 'uploading') {
					console.log(info.file, info.fileList);
				}
				if (info.file.status === 'done') {
					message.success(`${info.file.name} 上传成功！`);
					// _this.setState({
					// 	pdfUrl:AjaxUrl + info.file.response.url,
					// 	wordName:info.file.response.wordName
					// })

				} else if (info.file.status === 'error') {
					message.error(`${info.file.name} 上传失败！`);
				}
			},
		};
		return props;
	};
	render() {
		const { getFieldDecorator } = this.props.form ;
		console.log(this.state.basicForm)
		console.log(this.props)
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
			<div>
			  <Icon type={!this.state.loading ? 'loading' : 'plus'} />
			  <div className="ant-upload-text">上传</div>
			</div>
		  );
		const { imageUrl, basicForm, startTime, endTime } = this.state
		return (
			<div className="shadow-radius form-box">
				<div className="public-title">
					<h1>基本设置</h1>
				</div>
				<Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign="left" className="base-form">
					<Form.Item label="网站名称">
						{getFieldDecorator('webname', {
							initialValue: data ? data.webname : '',
						})(<Input placeholder="请输入网站名称"/>)}

						<span className="text"> <Icon type="info-circle" /> 如：便利聘人才网</span>
					</Form.Item>
					<Form.Item label="网站LOGO" >
					   <Upload
							{...this.getPdfURL()}
							className="avatar-uploader"
							fileList={this.state.fileList}
							showUploadList={false}
							>
							{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
						</Upload>
					</Form.Item>
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
							initialValue: data ? data.is_open : false,
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
					<Form.Item label="站长电话:" value={ basicForm.owenerTel}>
					    {getFieldDecorator('owenerTel', {
							initialValue: data ? data.owenerTel : '',
						})(<Input placeholder="请输入站长电话"/>)}
					</Form.Item>
					<Form.Item label="备案号:" value={ basicForm.recordNumber}>
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
						<TimePicker format={format} value={moment(startTime, format)} defaultValue={moment('09:00', format)}/> - <TimePicker  value={moment(endTime, format)}  defaultValue={moment('17:00', format)} format={format} />
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
						<Button htmlType="submit" className="save-btn">
							保存
						</Button>

						<Button type="primary" htmlType="submit">
							取消
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}
export default Form.create()(BasicForm);
