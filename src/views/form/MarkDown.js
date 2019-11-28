import React from 'react';
import { Form, Input, Button, Icon, message  } from 'antd';
// import Editor from 'for-editor';
import $axios from '../../axios/$axios';
const { TextArea } = Input;
class BasicSetting extends React.Component {
	constructor() {
		super();
		this.state = {
			value: ''
		};
	}
	handleChange(value) {
		this.setState({
			value
		});
	}
	componentWillMount() {
		this.fetch()
	}
	fetch = () => {
		$axios.post('http://tiantianxsg.com:39888/admin.php/config/getFkeyword').then(data => {
			this.setState({
				value: data.data.fkeyword
			})
		});
	};
	save = (fkeyword) => {
		$axios.post('http://tiantianxsg.com:39888/admin.php/config/saveFkeyword?id=1&fkeyword=' + fkeyword).then(res => {
			if (res.status ==200) {
				message.success('保存成功');
				this.fetch()
			}
		});	
	}
	handleSubmit= e =>{
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.save(values.keyword)
			}
		})	   
	}
	render() {
		const formItemLayout = {
			labelCol: {
				sm: { span: 4 }
			},
			wrapperCol: {
				sm: { span: 8 }
			}
		};
		const { getFieldDecorator } = this.props.form;
		const { data } = this.props || null
		return (
			<div className="shadow-radius basic-setting">
				<Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign="left" className="base-form">
				   <Form.Item label="关键词过滤:">
				        {getFieldDecorator('keyword', {
							initialValue: data ? data.keyword : '',
						})(<TextArea rows={4} placeholder="请输入关键词" />)}	
						<span className="keyword"> <Icon type="info-circle" />  如： 香港，暴动</span>
					</Form.Item>
					<div className="form-btn">
						<Button htmlType="submit">
							保存
						</Button>
						<Button type="primary" onClick={this.fetch}>
							取消
						</Button>
				   </div>
			    </Form>		
			</div>
		);
	}
}
export default Form.create()(BasicSetting);