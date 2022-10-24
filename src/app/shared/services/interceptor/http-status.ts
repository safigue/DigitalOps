import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class HttpStatus {
    private requestInFlight: BehaviorSubject<boolean>;

    constructor() {
        this.requestInFlight = new BehaviorSubject(true);
    }

    /**
     *
     * @param inFlight Flag to specify whether the request is pending / finished
     */
    setStatus(inFlight: boolean) {
        this.requestInFlight.next(inFlight);
    }

    /**
     *
     * @description To fetch the status of the request
     */
    getStatus(): Observable<boolean> {
        return this.requestInFlight.asObservable();
    }
}
