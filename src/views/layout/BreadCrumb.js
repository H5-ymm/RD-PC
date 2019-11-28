import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb ,Icon} from 'antd';
import { menus } from '@/router/menus';
import $axios from '../../axios/$axios';
class BreadCrumb extends React.Component {
  state = {
    list: []
  }
	createBreadCrumbData = (location, data) => {
    console.log(location)
    console.log(data)
		let arrA = [];
		let arrB = [];
		let arrC = [];
		data.forEach(a => {
			if (location.pathname === a.description) {
				arrA.push(a);
			}
			if (a.children && a.children.length > 0) {
				a.children.forEach(b => {
					if (location.pathname === b.description) {
						arrB.push(b);
						arrA.push({
							icon: a.icon || '',
							path: a.description,
							title: a.description
						});
					}
					if (b.children && b.children.length > 0) {
						b.children.forEach(c => {
							if (location.pathname === c.createBreadCrumbData) {
								arrC.push(c);
								arrB.push({
									icon: b.icon || '',
									path: b.description,
									title: b.description
								});
								arrA.push({
									icon: a.icon || '',
									path: a.description,
									title: a.description
								});
							}
						});
					}
				});
			}
		});
		// console.log(arrA, arrB, arrC);
		return [...arrA, ...arrB, ...arrC];
  };
  componentWillMount() {
    this.fetch()
  }
	fetch = () => {
		// this.setState({ loading: true });
		$axios.post('http://tiantianxsg.com:39888/admin.php/index/getRole?uid=1').then(data => {
      console.log(data.data)
      this.setState({
        list:  data.data.data
      })
		});
	};
	render() {
		const { location } = this.props;
		const routes = this.createBreadCrumbData(location, this.state.list);
		// console.log(routes);
		if (!routes.length) return null;
		const itemRender = (route, params, routes, paths) => {
			const last = routes.indexOf(route) === routes.length - 1;
			return last ? <Link to={route.path}>{route.icon && <Icon type={route.icon} />} {route.title}</Link> : <span>{route.icon && <Icon type={route.icon} />} {route.title}</span>;
		};
		return (
			<div className="breadCrumb">
				<Breadcrumb routes={routes} itemRender={itemRender} />
			</div>
		);
	}
}

export default withRouter(BreadCrumb);
