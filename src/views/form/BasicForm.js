import React, { Component } from 'react';
import { Form, message  } from 'antd';
import $axios from '../../axios/$axios';
import { changeConfig } from '../../api/setting'
import SettingForm from '../../components/SettingForm';
class BasicForm extends Component {
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
		startTime: '',
		endTime: '',
		id: '',
		file: ''
	};
	handleSubmit = e => {
		e.preventDefault();
		this.formRef.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.is_open = values.is_open ? 1 : 0
				values.workTime = this.state.startTime + (this.state.startTime ? '-' : '') +  this.state.endTime
        values.id = this.state.id
        values.weblogo = this.state.file
				changeConfig(values).then(res => {
					if (res.status.code === 200) {
						message.success('保存成功');
					}	
				})
			}
	 });
  };
  getLogoImg = value => {
    this.setState({
      file: value
    })
  }
  getStartTime = value => {
    this.setState({
      startTime: value
    })
  }
   
  getTime = value => {
    this.setState({
      endTime: value
    })
  }
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
	render() {
		return (
			<div className="shadow-radius form-box">
				<div className="public-title">
					<h1>基本设置</h1>
				</div>
        <SettingForm data={this.state.basicForm} getLogoImg={this.getLogoImg} getStartTime={this.getStartTime} getTime={this.getTime} visible={true} handleSubmit={this.handleSubmit}  wrappedComponentRef={form => (this.formRef = form)}  />
			</div>
		);
	}
}
export default Form.create()(BasicForm);
