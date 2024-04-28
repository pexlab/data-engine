import { customAlphabet } from 'nanoid';

export const DocumentIdentifierSize     = 11;
export const DocumentIdentifierAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function DocumentIdentifier() {
    return customAlphabet( DocumentIdentifierAlphabet )( DocumentIdentifierSize );
}

export type ForCreate<T> = Omit<T, 'id'>;
export type ForUpdate<T> = Partial<Omit<T, 'id'>>;

import { Observable, OperatorFunction, Subscription } from 'rxjs';

export function startEmittingAfter<T>( timeout?: number ): OperatorFunction<T, T> {
    return ( source: Observable<T> ) => new Observable<T>( observer => {
        
        let buffer: ( {
                          type: 'next',
                          value: T
                      } | {
                          type: 'error',
                          error: any
                      } | {
                          type: 'complete'
                      } )[]    = [];
        let buffering: boolean = true;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        
        const clear = () => {
            if ( timeoutId ) {
                clearTimeout( timeoutId );
                timeoutId = undefined;
            }
        };
        
        const emitBuffer = () => {
            buffer.forEach( item => {
                switch ( item.type ) {
                    case 'next':
                        observer.next( item.value );
                        break;
                    case 'error':
                        observer.error( item.error );
                        break;
                    case 'complete':
                        observer.complete();
                        break;
                }
            } );
            buffer    = [];
            buffering = false;
            clear();
        };
        
        const subscription = source.subscribe( {
            next( value ) {
                if ( buffering ) {
                    buffer.push( {
                        type : 'next',
                        value: value
                    } );
                } else {
                    observer.next( value );
                }
            },
            error( err ) {
                if ( buffering ) {
                    buffer.push( {
                        type : 'error',
                        error: err
                    } );
                } else {
                    observer.error( err );
                }
            },
            complete() {
                if ( buffering ) {
                    buffer.push( {
                        type: 'complete'
                    } );
                } else {
                    observer.complete();
                }
            }
        } );
        
        clear();
        
        if ( timeout ) {
            timeoutId = setTimeout( () => {
                emitBuffer();
            }, timeout );
        } else {
            buffering = false;
        }
        
        return () => {
            clear();
            subscription.unsubscribe();
        };
    } );
}

export function subscriptionCallback<T>( onSubscribe?: ( subscription: Subscription ) => void, onTeardown?: () => void ): OperatorFunction<T, T> {
    return ( source: Observable<T> ) => new Observable<T>( observer => {
        
        const subscription = source.subscribe( {
            next( value ) {
                observer.next( value );
            },
            error( err ) {
                observer.error( err );
            },
            complete() {
                observer.complete();
            }
        } );
        
        if ( onSubscribe ) {
            onSubscribe( subscription );
        }
        
        return () => {
            
            if ( onTeardown ) {
                onTeardown();
            }
            
            subscription.unsubscribe();
        };
    } );
}
