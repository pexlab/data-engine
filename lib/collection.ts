import { inject, Inject } from '@angular/core';
import { AlertPortalService } from '@pexlab/ngx-front-engine';
import PLazy from 'p-lazy';
import pMinDelay from 'p-min-delay';
import { RxError } from 'rxdb/dist/types/rx-error';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, Subscription, tap } from 'rxjs';
import { z } from 'zod';
import { IntermediateCollection } from './types/types';
import { DocumentIdentifier, ForCreate, ForUpdate, startEmittingAfter, subscriptionCallback } from './utils';

export class Collection<Doc> {
    
    private alert = inject(AlertPortalService);
    
    constructor( private collection: IntermediateCollection<Doc> ) {}
    
    public create( document: ForCreate<Doc> ) {
        return {
            plain    : ( options?: { alertPortal?: string } ) => {
                return this.composePlainInputAndResultFromPromise( {
                    ...options,
                    input  : document,
                    promise: ( value ) => this.collection.insert( {
                        id: DocumentIdentifier(),
                        ...value
                    } as Doc )
                } );
            },
            safeguard: <InputParser extends z.ZodType<any, any, any>, ResultParser extends z.ZodType<any, any, any>>( options: {
                inputDocument: InputParser,
                resultDocument: ResultParser,
                alertPortal?: string,
            } ) => {
                return this.composeSafeguardedInputAndResultFromPromise( {
                    ...options,
                    input  : document,
                    promise: ( value ) =>
                        this.collection.insert( {
                            id: DocumentIdentifier(),
                            ...value
                        } as Doc )
                } );
            }
        };
    }
    
    public read = {
        single  : {
            usingId   : ( id: string ) => {
                return {
                    plain    : ( options?: { alertPortal?: string } ) => {
                        return this.composePlainResultFromObservable( {
                            ...options,
                            observable: () => this.collection.findOne( id ).$
                        } );
                    },
                    safeguard: <ResultParser extends z.ZodType<any, any, any>>( options: {
                        resultDocument: ResultParser,
                        alertPortal?: string
                    } ) => {
                        return this.composeSafeguardedResultFromObservable( {
                            ...options,
                            observable: () => this.collection.findOne( id ).$
                        } );
                    }
                };
            },
            usingQuery: ( query: Parameters<typeof this.collection['findOne']>[0] ) => {
                return {
                    plain    : ( options?: { alertPortal?: string } ) => {
                        return this.composePlainResultFromObservable( {
                            ...options,
                            observable: () => this.collection.findOne( query ).$
                        } );
                    },
                    safeguard: <ResultParser extends z.ZodType<any, any, any>>( options: {
                        resultDocument: ResultParser,
                        alertPortal?: string
                    } ) => {
                        return this.composeSafeguardedResultFromObservable( {
                            ...options,
                            observable: () => this.collection.findOne( query ).$
                        } );
                    }
                };
            }
        },
        multiple: {
            usingIds  : ( ids: string[] ) => {
                return {
                    plain    : ( options?: { alertPortal?: string } ) => {
                        return this.composePlainResultFromObservable( {
                            ...options,
                            observable: () => this.collection.findByIds( ids ).$.pipe(
                                map( documents => [ ...documents ].map( document => document[ 1 ] ) )
                            )
                        } );
                    },
                    safeguard: <ResultParser extends z.ZodType<any, any, any>>( options: {
                        resultDocument: ResultParser,
                        alertPortal?: string
                    } ) => {
                        return this.composeSafeguardedResultFromObservable( {
                            ...options,
                            observable: () => this.collection.findByIds( ids ).$.pipe(
                                map( documents => [ ...documents ].map( document => document[ 1 ] ) )
                            )
                        } );
                    }
                };
            },
            usingQuery: ( query: Parameters<typeof this.collection['find']>[0] ) => {
                return {
                    plain    : ( options?: { alertPortal?: string } ) => {
                        return this.composePlainResultFromObservable( {
                            ...options,
                            observable: () => this.collection.find( query ).$
                        } );
                    },
                    safeguard: <ResultParser extends z.ZodType<any, any, any>>( options: {
                        resultDocument: ResultParser,
                        alertPortal?: string
                    } ) => {
                        return this.composeSafeguardedResultFromObservable( {
                            ...options,
                            observable: () => this.collection.find( query ).$
                        } );
                    }
                };
            }
        },
        all     : {
            plain    : ( options?: { alertPortal?: string } ) => {
                return this.composePlainResultFromObservable( {
                    ...options,
                    observable: () => this.collection.find().$
                } );
            },
            safeguard: <ResultParser extends z.ZodType<any, any, any>>( options: {
                resultDocument: ResultParser,
                alertPortal?: string
            } ) => {
                return this.composeSafeguardedResultFromObservable( {
                    ...options,
                    observable: () => this.collection.find().$
                } );
            }
        }
    };
    
    public update = {
        single  : {
            usingId   : ( id: string ) => {
                return {
                    withDocument: ( document: ForUpdate<Doc> ) => {
                        return {
                            plain    : ( options?: { alertPortal?: string } ) => {
                                return this.composePlainInputAndResultFromPromise( {
                                    ...options,
                                    input  : document,
                                    promise: ( value ) => this.collection.findOne( id ).exec().then( ( document ) => {
                                        return document?.patch( value as Doc );
                                    } )
                                } );
                            },
                            safeguard: <InputParser extends z.ZodType<any, any, any>, ResultParser extends z.ZodType<any, any, any>>( options: {
                                inputDocument: InputParser,
                                resultDocument: ResultParser,
                                alertPortal?: string
                            } ) => {
                                return this.composeSafeguardedInputAndResultFromPromise( {
                                    ...options,
                                    input  : document,
                                    promise: ( value ) => this.collection.findOne( id ).exec().then( ( document ) => {
                                        return document?.patch( value as Doc );
                                    } )
                                } );
                            }
                        };
                    }
                };
            },
            usingQuery: ( query: Parameters<typeof this.collection['findOne']>[0] ) => {
                return {
                    withDocument: ( document: ForUpdate<Doc> ) => {
                        return {
                            plain    : ( options?: { alertPortal?: string } ) => {
                                return this.composePlainInputAndResultFromPromise( {
                                    ...options,
                                    input  : document,
                                    promise: ( value ) => this.collection.findOne( query ).exec().then( ( document ) => {
                                        return document?.patch( value as Doc );
                                    } )
                                } );
                            },
                            safeguard: <InputParser extends z.ZodType<any, any, any>, ResultParser extends z.ZodType<any, any, any>>( options: {
                                inputDocument: InputParser,
                                resultDocument: ResultParser,
                                alertPortal?: string
                            } ) => {
                                return this.composeSafeguardedInputAndResultFromPromise( {
                                    ...options,
                                    input  : document,
                                    promise: ( value ) => this.collection.findOne( query ).exec().then( ( document ) => {
                                        return document?.patch( value as Doc );
                                    } )
                                } );
                            }
                        };
                    }
                };
            }
        },
        multiple: {
            usingQuery: ( query: Parameters<typeof this.collection['find']>[0] ) => {
                return {
                    withDocument: ( document: ForUpdate<Doc> ) => {
                        return {
                            plain    : ( options?: { alertPortal?: string } ) => {
                                return this.composePlainInputAndResultFromPromise( {
                                    ...options,
                                    input  : document,
                                    promise: ( value ) => this.collection.find( query ).exec().then( ( documents ) => {
                                        return Promise.all( documents.map( document => document.patch( value as Doc ) ) );
                                    } )
                                } );
                            },
                            safeguard: <InputParser extends z.ZodType<any, any, any>, ResultParser extends z.ZodType<any, any, any>>( options: {
                                inputDocument: InputParser,
                                resultDocument: ResultParser,
                                alertPortal?: string
                            } ) => {
                                return this.composeSafeguardedInputAndResultFromPromise( {
                                    ...options,
                                    input  : document,
                                    promise: ( value ) => this.collection.find( query ).exec().then( ( documents ) => {
                                        return Promise.all( documents.map( document => document.patch( value as Doc ) ) );
                                    } )
                                } );
                            }
                        };
                    }
                };
            }
        }
    };
    
    public delete = {
        usingId   : ( id: string ) => {
            return {
                plain    : ( options?: { alertPortal?: string } ) => {
                    return this.composePlainResultFromPromise( {
                        ...options,
                        promise: () => this.collection.findOne( id ).remove()
                    } );
                },
                safeguard: <ResultParser extends z.ZodType<any, any, any>>( options: {
                    resultDocument: ResultParser,
                    alertPortal?: string
                } ) => {
                    return this.composeSafeguardedResultFromPromise( {
                        ...options,
                        promise: () => this.collection.findOne( id ).remove()
                    } );
                }
            };
        },
        usingQuery: ( query: Parameters<typeof this.collection['find']>[0] ) => {
            return {
                plain    : ( options?: { alertPortal?: string } ) => {
                    return this.composePlainResultFromPromise( {
                        ...options,
                        promise: () => this.collection.find( query ).exec().then( ( documents ) => {
                            return Promise.all( documents.map( document => document.remove() ) );
                        } )
                    } );
                },
                safeguard: <ResultParser extends z.ZodType<any, any, any>>( options: {
                    resultDocument: ResultParser,
                    alertPortal?: string
                } ) => {
                    return this.composeSafeguardedResultFromPromise( {
                        ...options,
                        promise: () => this.collection.find( query ).exec().then( ( documents ) => {
                            return Promise.all( documents.map( document => document.remove() ) );
                        } )
                    } );
                }
            };
        }
    };
    
    private composePlainInputAndResultFromPromise<
        OriginalInputType,
        OriginalResultType
    >( composeOptions: {
        input: OriginalInputType,
        alertPortal?: string,
        promise: ( input: OriginalInputType ) => Promise<OriginalResultType>
    } ) {
        
        const refinedPromise = ( options?: {
            delayBegin?: number,
            onData?: ( data: OriginalResultType ) => void,
            onError?: ( error: any ) => void
        } ) => new Promise<OriginalResultType>( ( resolve, reject ) => {
            
            ( options?.delayBegin ?
              pMinDelay( composeOptions.promise( composeOptions.input ), options.delayBegin ) :
              composeOptions.promise( composeOptions.input )
            ).then( ( input ) => {
                
                options?.onData?.( input );
                resolve( input );
                
            } ).catch( ( error ) => {
                
                if ( composeOptions.alertPortal ) {
                    this.emitRxError( error, composeOptions.alertPortal );
                }
                
                options?.onError?.( error );
                reject( error );
            } );
        } );
        
        return {
            asPromise    : refinedPromise,
            asLazyPromise: ( options?: {
                delayBegin?: number,
                onData?: ( data: OriginalResultType ) => void,
                onSubscribe?: () => void,
                onError?: ( error: any ) => void
            } ) => {
                return PLazy.from( () => {
                    options?.onSubscribe?.();
                    return refinedPromise( {
                        delayBegin: options?.delayBegin,
                        onData    : options?.onData,
                        onError   : options?.onError
                    } );
                } );
            }
        };
    }
    
    private composeSafeguardedInputAndResultFromPromise<
        OriginalInputType,
        InputParser extends z.ZodType<any, any, any>,
        ResultParser extends z.ZodType<any, any, any>,
        ParsedResultType = z.infer<ResultParser>
    >( composeOptions: {
        input: OriginalInputType,
        inputDocument: InputParser,
        resultDocument: ResultParser,
        alertPortal?: string,
        promise: ( input: OriginalInputType ) => Promise<any>
    } ) {
        
        const refinedPromise = ( options?: {
            delayBegin?: number,
            onData?: ( data: ParsedResultType ) => void,
            onError?: ( error: any ) => void
        } ) => {
            
            const parsedInput = composeOptions.inputDocument.safeParse( composeOptions.input );
            
            if ( !parsedInput.success ) {
                
                if ( composeOptions.alertPortal ) {
                    this.alert.emit( composeOptions.alertPortal, {
                        type       : 'error',
                        title      : 'Verarbeitungsfehler',
                        description: 'Bei der Kontrolle der Eingabedaten sind Unstimmigkeiten aufgetreten. ' +
                            'Es wird ein anderes Format erwartet.\n' +
                            'Folgender Fehlerbericht wurde erzeugt:',
                        code       : JSON.stringify( {
                            received    : composeOptions.input,
                            zodException: parsedInput.error
                        }, null, 2 )
                    } );
                }
                
                options?.onError?.( parsedInput.error );
                throw parsedInput.error;
            }
            
            return new Promise<ParsedResultType>( ( resolve, reject ) => {
                
                ( options?.delayBegin ?
                  pMinDelay( composeOptions.promise( parsedInput.data ), options.delayBegin ) :
                  composeOptions.promise( parsedInput.data )
                ).then( ( result ) => {
                    
                    const parsedResult = composeOptions.resultDocument.safeParse( result );
                    
                    if ( !parsedResult.success ) {
                        
                        if ( composeOptions.alertPortal ) {
                            this.alert.emit( composeOptions.alertPortal, {
                                type       : 'error',
                                title      : 'Verarbeitungsfehler',
                                description: 'Bei der Kontrolle der Daten von der Datenbank sind Unstimmigkeiten aufgetreten. ' +
                                    'Es wird ein anderes Format erwartet.\n' +
                                    'Folgender Fehlerbericht wurde erzeugt:',
                                code       : JSON.stringify( {
                                    received    : result,
                                    zodException: parsedResult.error
                                }, null, 2 )
                            } );
                        }
                        
                        options?.onError?.( parsedResult.error );
                        reject( parsedResult.error );
                        return;
                    }
                    
                    options?.onData?.( parsedResult.data );
                    resolve( parsedResult.data );
                    
                } ).catch( ( error ) => {
                    
                    if ( composeOptions.alertPortal ) {
                        this.emitRxError( error, composeOptions.alertPortal );
                    }
                    
                    options?.onError?.( error );
                    reject( error );
                } );
                
            } );
        };
        
        return {
            asPromise    : refinedPromise,
            asLazyPromise: ( options?: {
                delayBegin?: number,
                onData?: ( data: ParsedResultType ) => void,
                onSubscribe?: () => void,
                onError?: ( error: any ) => void
            } ) => {
                return PLazy.from( () => {
                    options?.onSubscribe?.();
                    return refinedPromise( {
                        delayBegin: options?.delayBegin,
                        onData    : options?.onData,
                        onError   : options?.onError
                    } );
                } );
            }
        };
    }
    
    private composePlainResultFromPromise<OriginalResultType>( composeOptions: {
        alertPortal?: string,
        promise: () => Promise<OriginalResultType>
    } ) {
        
        const refinedPromise = ( options?: {
            delayBegin?: number,
            onData?: ( data: OriginalResultType ) => void,
            onError?: ( error: any ) => void
        } ) => new Promise<OriginalResultType>( ( resolve, reject ) => {
            
            ( options?.delayBegin ?
              pMinDelay( composeOptions.promise(), options.delayBegin ) :
              composeOptions.promise()
            ).then( ( input ) => {
                
                options?.onData?.( input );
                resolve( input );
                
            } ).catch( ( error ) => {
                
                if ( composeOptions.alertPortal ) {
                    this.emitRxError( error, composeOptions.alertPortal );
                }
                
                options?.onError?.( error );
                reject( error );
            } );
        } );
        
        return {
            asPromise    : refinedPromise,
            asLazyPromise: ( options?: {
                delayBegin?: number,
                onData?: ( data: OriginalResultType ) => void,
                onSubscribe?: () => void,
                onError?: ( error: any ) => void
            } ) => {
                return PLazy.from( () => {
                    options?.onSubscribe?.();
                    return refinedPromise( {
                        delayBegin: options?.delayBegin,
                        onData    : options?.onData,
                        onError   : options?.onError
                    } );
                } );
            }
        };
    }
    
    private composeSafeguardedResultFromPromise<
        ResultParser extends z.ZodType<any, any, any>,
        ParsedResultType = z.infer<ResultParser>
    >( composeOptions: {
        resultDocument: ResultParser,
        alertPortal?: string,
        promise: () => Promise<any>
    } ) {
        
        const refinedPromise = ( options?: {
            delayBegin?: number,
            onData?: ( data: ParsedResultType ) => void,
            onError?: ( error: any ) => void
        } ) => {
            
            return new Promise<ParsedResultType>( ( resolve, reject ) => {
                
                ( options?.delayBegin ?
                  pMinDelay( composeOptions.promise(), options.delayBegin ) :
                  composeOptions.promise()
                ).then( ( result ) => {
                    
                    const parsedResult = composeOptions.resultDocument.safeParse( result );
                    
                    if ( !parsedResult.success ) {
                        
                        if ( composeOptions.alertPortal ) {
                            this.alert.emit( composeOptions.alertPortal, {
                                type       : 'error',
                                title      : 'Verarbeitungsfehler',
                                description: 'Bei der Kontrolle der Daten von der Datenbank sind Unstimmigkeiten aufgetreten. ' +
                                    'Es wird ein anderes Format erwartet.\n' +
                                    'Folgender Fehlerbericht wurde erzeugt:',
                                code       : JSON.stringify( {
                                    received    : result,
                                    zodException: parsedResult.error
                                }, null, 2 )
                            } );
                        }
                        
                        options?.onError?.( parsedResult.error );
                        reject( parsedResult.error );
                        return;
                    }
                    
                    options?.onData?.( parsedResult.data );
                    resolve( parsedResult.data );
                    
                } ).catch( ( error ) => {
                    
                    if ( composeOptions.alertPortal ) {
                        this.emitRxError( error, composeOptions.alertPortal );
                    }
                    
                    options?.onError?.( error );
                    reject( error );
                } );
                
            } );
        };
        
        return {
            asPromise    : refinedPromise,
            asLazyPromise: ( options?: {
                delayBegin?: number,
                onData?: ( data: ParsedResultType ) => void,
                onSubscribe?: () => void,
                onError?: ( error: any ) => void
            } ) => {
                return PLazy.from( () => {
                    options?.onSubscribe?.();
                    return refinedPromise( {
                        delayBegin: options?.delayBegin,
                        onData    : options?.onData,
                        onError   : options?.onError
                    } );
                } );
            }
        };
    }
    
    private composePlainResultFromObservable<DocumentResult>( composeOptions: {
        alertPortal?: string,
        observable: () => BehaviorSubject<DocumentResult> | Observable<DocumentResult>
    } ) {
        
        const originalObservable = composeOptions.observable();
        
        const refinedObservable = ( options?: {
            delayBegin?: number,
            onData?: ( result: DocumentResult ) => void,
            onSubscribe?: ( subscription: Subscription ) => void,
            onTeardown?: () => void,
            onError?: ( error: any ) => void
        } ) => {
            return originalObservable.pipe(
                subscriptionCallback( options?.onSubscribe, options?.onTeardown ),
                startEmittingAfter( options?.delayBegin ),
                catchError( ( error ) => {
                    
                    if ( composeOptions.alertPortal ) {
                        this.emitRxError( error, composeOptions.alertPortal );
                    }
                    
                    options?.onError?.( error );
                    throw error;
                } ),
                tap( options?.onData )
            ) as Observable<DocumentResult>;
        };
        
        return {
            asObservable : refinedObservable,
            asLazyPromise: ( options?: {
                delayBegin?: number,
                onData?: ( data: DocumentResult ) => void,
                onSubscribe?: ( subscription: Subscription ) => void,
                onError?: ( error: any ) => void
            } ) => {
                return PLazy.from( () => firstValueFrom( refinedObservable( {
                    delayBegin : options?.delayBegin,
                    onData     : options?.onData,
                    onSubscribe: options?.onSubscribe,
                    onError    : options?.onError
                } ) ) );
            },
            asPromise    : ( options?: {
                delayBegin?: number,
                onFulfil?: ( result: DocumentResult ) => void,
                onError?: ( error: any ) => void
            } ) => {
                return firstValueFrom( refinedObservable( {
                    delayBegin: options?.delayBegin,
                    onData    : options?.onFulfil,
                    onError   : options?.onError
                } ) );
            }
        };
    }
    
    private composeSafeguardedResultFromObservable<
        DocumentResult,
        ResultParser extends z.ZodType<any, any, any>,
        Result = z.infer<NonNullable<ResultParser>>
    >( composeOptions: {
        resultDocument: ResultParser,
        alertPortal?: string,
        observable: () => BehaviorSubject<DocumentResult> | Observable<DocumentResult>
    } ) {
        
        const originalObservable = composeOptions.observable();
        
        const refinedObservable = ( options?: {
            delayBegin?: number,
            onData?: ( data: Result ) => void,
            onSubscribe?: ( subscription: Subscription ) => void,
            onTeardown?: () => void,
            onError?: ( error: any ) => void
        } ) => {
            return originalObservable.pipe(
                subscriptionCallback( options?.onSubscribe, options?.onTeardown ),
                startEmittingAfter( options?.delayBegin ),
                catchError( ( error ) => {
                    
                    if ( composeOptions.alertPortal ) {
                        this.emitRxError( error, composeOptions.alertPortal );
                    }
                    
                    options?.onError?.( error );
                    
                    throw error;
                } ),
                map( ( result ) => {
                    
                    if ( !composeOptions.resultDocument ) {
                        return result;
                    }
                    
                    const parsed = composeOptions.resultDocument.safeParse( result );
                    
                    if ( parsed.success ) {
                        
                        return parsed.data;
                        
                    } else {
                        
                        if ( composeOptions.alertPortal ) {
                            this.alert.emit( composeOptions.alertPortal, {
                                type       : 'error',
                                title      : 'Verarbeitungsfehler',
                                description: 'Bei der Kontrolle der Daten von der Datenbank sind Unstimmigkeiten aufgetreten. ' +
                                    'Es wird ein anderes Format erwartet.\n' +
                                    'Folgender Fehlerbericht wurde erzeugt:',
                                code       : JSON.stringify( {
                                    received    : result,
                                    zodException: parsed.error
                                }, null, 2 )
                            } );
                        }
                        
                        throw parsed.error;
                    }
                } ),
                tap( options?.onData )
            ) as Observable<Result>;
        };
        
        return {
            asObservable : refinedObservable,
            asLazyPromise: ( options?: {
                delayBegin?: number,
                onData?: ( data: Result ) => void,
                onSubscribe?: ( subscription: Subscription ) => void,
                onTeardown?: () => void,
                onError?: ( error: any ) => void
            } ) => {
                return PLazy.from( () => firstValueFrom( refinedObservable( {
                    delayBegin : options?.delayBegin,
                    onData     : options?.onData,
                    onSubscribe: options?.onSubscribe,
                    onTeardown : options?.onTeardown,
                    onError    : options?.onError
                } ) ) );
            },
            asPromise    : ( options?: {
                delayBegin?: number,
                onData?: ( data: Result ) => void,
                onTeardown?: () => void,
                onError?: ( error: any ) => void
            } ) => {
                return firstValueFrom( refinedObservable( {
                    delayBegin: options?.delayBegin,
                    onData    : options?.onData,
                    onTeardown: options?.onTeardown,
                    onError   : options?.onError
                } ) );
            }
        };
    }
    
    private emitRxError( error: RxError, portal: string ) {
        this.alert.emit( portal, {
            type       : 'error',
            title      : 'Datenbankfehler',
            description: 'Es ist ein bisher undokumentierter Fehler aufgetreten\n' +
                'Folgender Fehlerbericht wurde erzeugt:',
            code       : error.toString()
        } );
    }
}