import React, { Component } from 'react';
import { Form, message  } from 'antd';
import { getCompanyInfo, companyEdit, companyCheck } from '../../api/company'
import CompanyForm from '../../components/CompanyForm';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
class TextEditor extends React.Component {
	state = {
		confirmDirty: false,
		loading: false,
		basicForm: {},
		uid: '',
    file: ''
	};
	handleSubmit = e => {
		e.preventDefault();
		this.formRef.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.provinceid = 1
        values.three_cityid = 444
        values.cityid  = 222
        values.uid = this.state.uid
        let obj = {
          license_url: "date/license_url.png",
          link_tel: "021-238881324",
          logo_url: "date/logo.png",
        }
        values = Object.assign(values, obj)
        // values.weblogo = this.state.file
				companyEdit(values).then(res => {
					if(res.status.code === 200) {
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
  };
	componentWillMount() {
    let uid = ''
    if (this.props.location.query) {
      uid = this.props.location.query.id
      sessionStorage.setItem('uid',this.props.location.query.id)
    }
    else {
      uid = sessionStorage.getItem('uid')
    }
	  this.fetch(uid)
	};
	fetch = (uid) => {
    this.setState({ loading: true });
    getCompanyInfo({uid}).then(res => {
      console.log(res.data)
      this.setState({
        basicForm: res.data,
        uid: res.data.uid
      })
    })
	};
	render() {
		return (
			<div className="shadow-radius company-box">
				<div className="public-title">
					<h1>查看企业信息</h1>
				</div>
        <CompanyForm data={this.state.basicForm} handleSubmit={this.handleSubmit} handleCancel={this.handleOk} visible={true} wrappedComponentRef={form => (this.formRef = form)}  />
			</div>
		);
	}
}
// export default ;
// export default withRouter(Form.create()(TextEditor))
const mapStateToProps = state => state;
export default withRouter(connect(mapStateToProps)(Form.create()(TextEditor)))
