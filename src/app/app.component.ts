import { Component, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	public data;
	public departments:Array<any> = [];
	public provinces:Array<any> = [];
	public districts:Array<any> = [];
	
	public getObject(data){
		if (data.trim() == '') return null
		data = data.trim().split(' ');
		return {
			code: data[0],
			name: data[1],
			parent: {}
		}
	}
	constructor(private http: HttpClient) {
		this.http.get('../assets/data.txt', {responseType: 'text'}).subscribe( res => {
			this.data = res.split(/\r\n|\n/);
			for (var i = 0; i < this.data.length; i++) {
				let info = this.data[i].split('"')[1];
				let parts = info.split("/");
				let department = this.getObject(parts[0]);
				department.parent['code'] = '-';
				department.parent['name'] = '-';
				let validateDepartment = this.departments.find(dep => dep.code == department.code);
				if (!validateDepartment) {
					this.departments.push(department);
				}
				let province = this.getObject(parts[1]);
				if (province) {
					province.parent = department;
					let validateProvince = this.provinces.find(prov =>  prov.code == province.code);
					if (!validateProvince) {
						this.provinces.push(province);
					}
					let district = this.getObject(parts[2]);
					if (district) {
						district.parent = province;
						let validateDistrict = this.districts.find(dis => dis.code == district.code);
						if (!validateDistrict) {
							this.districts.push(district);
						}
					}
				}
			}
		});
	}
}
