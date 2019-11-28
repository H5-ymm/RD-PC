import React, { Component }from 'react';
import { Form, message  } from 'antd';
import { getFkeyword, saveFkeyword } from '../../api/setting'
import KeywordForm from '../../components/KeywordForm';
class BasicSetting extends Component {
  state = {
    form: {}
  }
	componentWillMount() {
		this.fetch()
	}
	fetch = () => {
		getFkeyword().then(data => {
			this.setState({
				form: data.data
			})
		});
	};
	save = (fkeyword) => {
    let params = {
      id: 1,
      fkeyword: fkeyword
    }
		saveFkeyword(params).then(res => {
			if (res.status.code === 200) {
				message.success('保存成功');
			}
		});	
	}
	handleSubmit= e =>{
		e.preventDefault();
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
        this.setState({
          form: values.fkeyword
        })
				this.save(values.fkeyword)
			}
		})	   
	}
	render() {
		return (
			<div className="shadow-radius basic-setting">
        <KeywordForm data={this.state.form} handleCancel={this.fetch} handleSubmit={this.handleSubmit} visible={true} wrappedComponentRef={form => (this.formRef = form)}/>
			</div>
		);
	}
}
export default Form.create()(BasicSetting);