import React, { Component } from 'react';
import { Form, Input, Button, Icon  } from 'antd';
const { TextArea } = Input;
class KeywordForm extends Component {
	componentWillReceiveProps(nextProps) {
    console.log(nextProps)
		!nextProps.visible&&this.props.form.resetFields();
	};
	render() {
		const { getFieldDecorator } = this.props.form;
    const { data } = this.props || null;
    const formItemLayout = {
			labelCol: {
				sm: { span: 4 }
			},
			wrapperCol: {
				sm: { span: 8 }
			}
		};
		return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign="left" className="base-form">
      <Form.Item label="关键词过滤:" refs="keywordForm">
          {getFieldDecorator('fkeyword', {
            initialValue: data?data.fkeyword:'',
          })(<TextArea rows={4} placeholder="请输入关键词" />)}	
       <span className="keyword"> <Icon type="info-circle" />  如： 香港，暴动</span>
     </Form.Item>
     <div className="form-btn">
       <Button onClick={this.props.handleSubmit}>
         保存
       </Button>
       <Button type="primary" onClick={this.props.handleCancel}>
         取消
       </Button>
      </div>
     </Form>		
		);
	}
}
export default Form.create()(KeywordForm);
