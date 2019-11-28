import React, { Component } from 'react';
import { Form, Input, Button, Select, Radio } from 'antd';
const { Option } = Select;
function handleChange(value) {
	console.log(`selected ${value}`);
}
class EditForm extends Component {
	state = {
		value: 1,
		name: ''
	}
	componentWillReceiveProps(nextProps) {
		!nextProps.visible && this.props.form.resetFields();
	};
	onChange = e => {
		this.props.form.role_id = e.target.value
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { data } = this.props || null;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		};
		const formTailLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20, offset: 4 }
		};
		return (
			<Form onSubmit={this.handleSubmit} refs="editForm">
				<Form.Item label="账号:" {...formItemLayout}>
					{getFieldDecorator('name', {
						initialValue: data ? data.name : '',
						rules: [
							{
								required: true,
								message: '请输入账号'
							}
						]
					})(<Input className="inputWidth"/>)}
				</Form.Item>
				<Form.Item label="密码:" {...formItemLayout}>
					{getFieldDecorator('password', {
						initialValue: data ? data.password : '',
						rules: [
							{
								required: true,
								message: '请输入密码'
							}
						]
					})(<Input className="inputWidth"/>)}
				</Form.Item>
				<Form.Item label="真实姓名:" {...formItemLayout}>
					{getFieldDecorator('username', {
						initialValue: data ? data.username : '',
						rules: [
							{
								required: true,
								message: '请输入真实姓名'
								// pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
							}
						]
					})(<Input className="inputWidth"/>)}
				</Form.Item>
				<Form.Item label="权限:" {...formItemLayout} >
				   {getFieldDecorator('role_id', {
						initialValue: data ? data.role_id : '',
						rules: [
							{
								required: true,
								message: '请选择'
							}
						]
					})( <Select  onChange={handleChange} className="inputWidth">
							<Option value="1">管理员</Option>
							<Option value="2">客服</Option>
						</Select>)}
				</Form.Item>
				<Form.Item label="登录权限:" {...formItemLayout}>
				  <Radio.Group onChange={this.onChange} value={this.state.value} className="inputWidth">
					<Radio value={1}>禁用</Radio>
					<Radio value={2}>启用</Radio>
				  </Radio.Group>
				</Form.Item>
				<Form.Item {...formTailLayout} className="bottonBox">
				    <Button className="botton">
						取消 
					</Button>
					<Button type="primary" onClick={this.props.handleSubmit} className="botton">
						提交
					</Button>
				</Form.Item>
			</Form>
		);
	}
}
export default Form.create()(EditForm);
