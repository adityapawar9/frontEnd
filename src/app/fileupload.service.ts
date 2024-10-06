import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
    private baseUrl = 'http://localhost:8080/file'; // URL to your Spring Boot backend
  
    constructor(private http: HttpClient) { }
  
    uploadFile(file: File): Observable<string> {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
  
      return this.http.post<string>(`${this.baseUrl}/upload`, formData)
        .pipe(
          catchError(this.handleError)
        );
    }
  
    downloadFile(fileName: string): Observable<Blob> {
      return this.http.get(`${this.baseUrl}/download/${fileName}`, {
        responseType: 'blob'
      }).pipe(
        catchError(this.handleError)
      );
    }
  
    deleteFile(fileName: string): Observable<string> {
      return this.http.delete<string>(`${this.baseUrl}/delete/${fileName}`)
        .pipe(
          catchError(this.handleError)
        );
    }
  
    getFiles(): Observable<string[]> {
      return this.http.get<string[]>(`${this.baseUrl}/list`)
        .pipe(
          catchError(this.handleError)
        );
    }
  
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Unknown error!';
      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side errors
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
    }
  }