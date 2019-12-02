import React, { Component } from 'react';
import { Form, Input, Button, Icon, Col, Row, message, Select,  confirm, Modal } from 'antd';
import { uploadFile } from '../api/setting';
class UploadFrom extends Component {
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
	render() {
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
    if (!this.state.imageUrl) {
      imageUrl = 'http://tiantianxsg.com:39888/' + data.logo_url
    }
		return (
        <div>
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
      </div>
		)
	}
}
export default (UploadFrom);
