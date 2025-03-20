import { Injectable } from "@angular/core";
import { Configuration, DefaultService } from "../api";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environment";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public apiService!: DefaultService;

    constructor(
        private httpClient: HttpClient,
    ) {
        this.apiService = new DefaultService(httpClient, environment.apiUrl, new Configuration());
    }
}