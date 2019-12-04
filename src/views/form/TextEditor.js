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
    file: '',
    provinceid: '',
    three_cityid: '',
    cityid: '',
    license_url: '',
    telphone1: '',
    telphone2: ''
	};
	handleSubmit = e => {
		e.preventDefault();
		this.formRef.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.provinceid = this.state.provinceid
        values.three_cityid = this.state.three_cityid
        values.cityid  = this.state.cityid
        values.uid = this.state.uid
        let obj = {
          license_url: this.state.license_url,
          link_tel:this.state.telphone1 + '-' + this.state.telphone2,
          logo_url: this.state.file,
        }
        values = Object.assign(values, obj)
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
  getComImg = value => {
    this.setState({
      license_url: value
    })
  };
  getProvince = value => {
    this.setState({
      provinceid: value
    })
  }
  getCity = value => {
    this.setState({
      cityid: value
    })
  }
  geArea = value => {
    this.setState({
      three_cityid: value
    })
  }
  getTelphone = value => {
    this.setState({
      telphone1: value
    })
  }
  getTelphoneLaster = value => {
    this.setState({
      telphone2: value
    })
  }
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
        <CompanyForm data={this.state.basicForm} getTelphone={this.getTelphone} getTelphoneLaster={this.getTelphoneLaster}  getLogoImg={this.getLogoImg} getComImg={this.getComImg } handleSubmit={this.handleSubmit} getProvince={this.getProvince}  handleCancel={this.handleOk} getCity={this.getCity} visible={true} geArea={this.geArea}  wrappedComponentRef={form => (this.formRef = form)}  />
			</div>
		);
	}
}
// export default ;
// export default withRouter(Form.create()(TextEditor))
const mapStateToProps = state => state;
export default withRouter(connect(mapStateToProps)(Form.create()(TextEditor)))
