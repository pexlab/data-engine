import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '@pexlab/ngx-front-engine';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Component(
    {
        selector   : 'de-root',
        templateUrl: './app.component.html',
        styleUrls  : [ './app.component.scss' ]
    }
)

export class AppComponent implements OnInit, AfterViewChecked {

    private viewCounter = 1;

    constructor(
        private iconReg: SvgIconRegistryService,
        private theme: ThemeService,
        private router: Router
    ) {

        this.iconReg.loadSvg( 'assets/logo.svg', 'logo' );

        this.iconReg.loadSvg( 'assets/icons/at.svg', 'email' );
        this.iconReg.loadSvg( 'assets/icons/building-skyscraper.svg', 'building' );
        this.iconReg.loadSvg( 'assets/icons/calendar.svg', 'calendar' );
        this.iconReg.loadSvg( 'assets/icons/calendar-event.svg', 'calendar-event' );
        this.iconReg.loadSvg( 'assets/icons/calendar-time.svg', 'calendar-time' );
        this.iconReg.loadSvg( 'assets/icons/chevron-left.svg', 'left' );
        this.iconReg.loadSvg( 'assets/icons/circle-dashed.svg', 'circle-dashed' );
        this.iconReg.loadSvg( 'assets/icons/clock-hour-3.svg', 'clock' );
        this.iconReg.loadSvg( 'assets/icons/comments-solid.svg', 'comment' );
        this.iconReg.loadSvg( 'assets/icons/dialpad.svg', 'dialpad' );
        this.iconReg.loadSvg( 'assets/icons/eye.svg', 'eye' );
        this.iconReg.loadSvg( 'assets/icons/eye-solid.svg', 'eye-solid' );
        this.iconReg.loadSvg( 'assets/icons/gem-solid.svg', 'gem' );
        this.iconReg.loadSvg( 'assets/icons/hash.svg', 'hashtag' );
        this.iconReg.loadSvg( 'assets/icons/heart-solid.svg', 'heart' );
        this.iconReg.loadSvg( 'assets/icons/help-circle.svg', 'help' );
        this.iconReg.loadSvg( 'assets/icons/link.svg', 'link' );
        this.iconReg.loadSvg( 'assets/icons/lock.svg', 'lock' );
        this.iconReg.loadSvg( 'assets/icons/map-2.svg', 'location' );
        this.iconReg.loadSvg( 'assets/icons/moon-solid.svg', 'moon' );
        this.iconReg.loadSvg( 'assets/icons/phone.svg', 'phone' );
        this.iconReg.loadSvg( 'assets/icons/play-circle.svg', 'start' );
        this.iconReg.loadSvg( 'assets/icons/plus.svg', 'add' );
        this.iconReg.loadSvg( 'assets/icons/retweet-solid.svg', 'repost' );
        this.iconReg.loadSvg( 'assets/icons/search.svg', 'search' );
        this.iconReg.loadSvg( 'assets/icons/shopping-cart-solid.svg', 'shop' );
        this.iconReg.loadSvg( 'assets/icons/stop-circle.svg', 'stop' );
        this.iconReg.loadSvg( 'assets/icons/sun-solid.svg', 'sun' );
        this.iconReg.loadSvg( 'assets/icons/type.svg', 'text' );
        this.iconReg.loadSvg( 'assets/icons/user.svg', 'user' );

        this.theme.applyCommonTheme(
            {
                palette: {
                    accent: {
                        tab_bar: '#eeeeee'
                    }
                }
            }
        );

        this.theme.applyComponentThemes(
            {
                notepaper: {
                    backgroundHoles: '#eeeeee'
                }
            }
        );
    }

    public ngOnInit(): void {
        this.router.events.subscribe( {
            next: ( event ) => {
                if ( event instanceof NavigationEnd ) {
                    this.viewCounter = 0;
                    console.log( 'Page switched to: ' + event.url );
                }
            }
        } );
    }

    public ngAfterViewChecked(): void {
        console.log( '(' + this.viewCounter + ') View Checked' );
        this.viewCounter++;
    }
}
