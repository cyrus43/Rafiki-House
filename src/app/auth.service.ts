/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-undef */
import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap, delay, finalize, switchMap } from 'rxjs/operators';
import { ApplicationUser } from './application-user';
import { SurveyModel } from './survey-model';

interface LoginResult extends Partial<any> {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  permissions: [];
}
interface SignupDetails extends Partial<any> {
  username: string;
  email: string;
  password1: string;
  password2: string;
  referral_code: string;
  phone_number: string;
  full_name: string;
  device_details: { device: string };
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() email: EventEmitter<string> = new EventEmitter();
  private readonly apiUrl = `https://fullstack-role.busara.io`;
  private timer: Subscription;
  private _user = new BehaviorSubject<ApplicationUser>(null);
  user$: Observable<ApplicationUser> = this._user.asObservable();

  constructor(private router: Router, private http: HttpClient) {}

  ngOnDestroy(): void {}

  login(email: string, password: string) {
    const clientId = 'zVs3J7FZupB3TLPskQOy1xHLwYTRkzUSf2rdTDCu';
    const clientSecret =
      'Zv19oWmm416sTyjWT5Sx2r1gRwjWrXU3P5dWledQpYjxEvavS58SPtz03M8wvsgajaVLhcimmJIUUYUDad06V6HQosmPoj3TPRNjg7bgniQlooIwyFWfz8KfkM5Tdh7R';
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);
    body.set('username', email);
    body.set('password', password);
    return this.http
      .post<LoginResult>(
        `${this.apiUrl}/api/v1/oauth/token/`,
        body.toString(),
        {
          headers: new HttpHeaders().set(
            'Content-Type',
            'application/x-www-form-urlencoded'
          ),
        }
      )
      .pipe(
        map((x) => {
          this.setTokenInStorage(x.access_token);
          return x;
        })
      );
  }
  logout() {
    return this.clearLocalStorage();
  }
  signup(
    phoneNumber: string,
    name: string,
    email: string,
    password1: string,
    password2: string
  ) {
    return this.http
      .post<SignupDetails>(`${this.apiUrl}/api/v1/users/registration/`, {
        full_name: name,
        phone_number: phoneNumber,
        username: email,
        email,
        password1,
        password2,
        referral_code: '',
        device_details: { device: 'Dummy' },
        location: 'Nairobi',
      })
      .pipe(
        map((x) => {
          return x;
        })
      );
  }
  setTokenInStorage(x: string) {
    localStorage.setItem('access-token', x);
  }
  setUserInStorage(x: ApplicationUser) {
    localStorage.setItem('user', JSON.stringify(x));
  }
  getUserDetails() {
    this.http
      .get<ApplicationUser>(`${this.apiUrl}/api/v1/users/current-user`)
      .subscribe((userDetails) => {
        this.setUserInStorage(userDetails);
      });
  }
  getSurveys() {
    return this.http.get<any>(
      `${this.apiUrl}/api/v1/recruitment/forms/?node_type=Both`
    );
  }
  submitAnswers(questionId, columnMatch, answer, userId, surveyId) {
    return this.http
      .post<any>(`${this.apiUrl}/api/v1/recruitment/answers/submit/`, [
        {
          local_id: 8,
          start_time: '2021-07-08 19:10:30.457 +0300',
          location: {
            lon: 0.0,
            accuracy: 0.0,
            lat: 0.0,
          },
          ans: [
            {
              q_id: questionId,
              q_ans: answer,
              column_match: columnMatch,
            },
          ],
          user: userId,
          survey_id: surveyId,
          end_time: '2021-07-08 23:00:08.032 +0300',
        },
      ])
      .pipe(
        map((x) => {
          return x;
        })
      );
  }
  isLoggedIn(): boolean {
    if (localStorage.getItem('access-token')) {
      return true;
    }
    return false;
  }
  clearLocalStorage() {
    localStorage.clear();
  }
}
