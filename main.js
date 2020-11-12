( function() {

    const input = ( function() {
        const keys = {
            left: 37,
            right: 39,
            up: 38
        };

        const generateList = () => {
            const list = {};
            for ( const key in keys ) {
                list[ key ] = false;
            }
            return list;
        };

        const keysHeld = generateList();
        const keysPressed = generateList();

        const codeToKey = ( code ) => {
            for ( const key in keys ) {
                if ( keys[ key ] === code ) {
                    return key;
                }
            }
        };

        const setKeysHeld = ( value, code ) => {
            const key = codeToKey( code );
            if ( key ) {
                keysHeld[ key ] = value;
            }
        };

        window.addEventListener( `keydown`, function( event ) {
            setKeysHeld( true, event.keyCode );
        });

        window.addEventListener( `keyup`, function( event ) {
            setKeysHeld( false, event.keyCode );
        });

        return {
            held: ( key ) => keysHeld[ key ]
        };
    })();

    const createLimitedNumber = ( start, max, min ) => {
        let value = start;
        return {
            get: () => value,
            set: function( newValue ) {
                value = newValue;
                if ( value > max ) {
                    value = max;
                }
                else if ( value < min ) {
                    value = min;
                }
                return value;
            },
            add: function( amount ) {
                return this.set( value + amount );
            },
            sub: function( amount ) {
                return this.set( value - amount );
            },
            testSub: function( amount ) {
                return value - amount >= min;
            },
            div: function( amount ) {
                return this.set( value / amount );
            },
            multi: function( amount ) {
                return this.set( value * amount );
            },
            hitMin: function() {
                return value === min;
            }
        }
    };

    const blockSize = 16;
    const blocksToPixels = ( blocks ) => blocks * blockSize;
    const pixelsToBlocks = ( pixels ) => Math.floor( pixels / blockSize );

    const canvasWidth = 25;
    const canvasHeight = 14;
    const canvasWidthPixels = blocksToPixels( canvasWidth );
    const canvasHeightPixels = blocksToPixels( canvasHeight );

    const canvasRect = { x: 0, y: 0, w: canvasWidthPixels, h: canvasHeightPixels };

    const canvas = document.getElementById('nasrin-canvas');
    const ctx = canvas.getContext('2d');

    const renderRect = function( rect, color ) {
        ctx.fillStyle = color;
        ctx.fillRect( rect.x, rect.y, rect.w, rect.h );
    };

    const colorCanvas = function( color ) {
        renderRect( canvasRect, color );
    };

    const clearCanvas = function() {
        ctx.clearRect( canvasRect.x, canvasRect.y, canvasRect.w, canvasRect.h );
    };

    const renderObject = function( object ) {
        renderRect( object.coords, `#fff` );
    };

    const createScene = () => {
        return {
            grid: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ],
            width: canvasWidth,
            height: canvasHeight,
            index: function( x, y ) { return y * this.width + x; },
            render: function() {
                for ( let y = 0; y < this.height; ++y )
                {
                    for ( let x = 0; x < this.width; ++x )
                    {
                        const box = { x: blocksToPixels( x ), y: blocksToPixels( y ), w: blockSize, h: blockSize };
                        if ( this.grid[ this.index( x, y ) ] === 1 ) {
                            renderRect( box, `#fff` );
                        }
                        else if ( this.grid[ this.index( x, y ) ] === 2 ) {
                            renderRect( box, `#f00` );
                        }
                        else if ( this.grid[ this.index( x, y ) ] === 3 ) {
                            renderRect( box, `#ff0` );
                        }
                    }
                }
            }
        };
    };

    const createPlayer = () => {
        return {
            coords: { x: blocksToPixels( 2 ), y: blocksToPixels( 2 ), w: 16, h: 24 },
            accx: 0,
            accy: 0,
            vx: createLimitedNumber( 0, 4, -4 ),
            vy: createLimitedNumber( 0, 4, -5 ),
            state: `falling`,
            jumpLock: false,
            right: function() { return this.coords.x + this.coords.w; },
            bottom: function() { return this.coords.y + this.coords.h },
            update: function() {
                if ( this.state === `ground` ) {
                    this.state = `falling`;
                }

                if ( input.held( `right` ) ) {
                    this.accx = 0.25;
                }
                else if ( input.held( `left` ) ) {
                    this.accx = -0.25;
                }
                else {
                    this.accx = 0;
                }
                if ( this.accx === 0 ) {
                    this.vx.div( 1.15 );
                }
                else {
                    this.vx.add( this.accx );
                }
                this.coords.x += this.vx.get();

                if ( this.state === `jump` ) {
                    this.accy = -0.5;
                }
                else if ( this.state === `falling` ) {
                    this.accy = 0.25;
                }
                this.vy.add( this.accy );

                if ( this.state === `jump` && ( this.vy.hitMin() || !input.held( `up` ) ) ) {
                    this.state = `falling`;
                }

                this.coords.y += this.vy.get();

                const bottomXTile = pixelsToBlocks( this.bottom() - 4.0 );
                const topXTile = pixelsToBlocks( this.coords.y + 4.0 );
                const leftXTile = pixelsToBlocks( this.coords.x );
                const rightXTile = pixelsToBlocks( this.right() );
                const leftBottomTileIndex = scene.index( leftXTile, bottomXTile );
                const rightBottomTileIndex = scene.index( rightXTile, bottomXTile );
                const leftTopTileIndex = scene.index( leftXTile, topXTile );
                const rightTopTileIndex = scene.index( rightXTile, topXTile );
                const leftBottomTile = scene.grid[ leftBottomTileIndex ];
                const rightBottomTile = scene.grid[ rightBottomTileIndex ];
                const leftTopTile = scene.grid[ leftTopTileIndex ];
                const rightTopTile = scene.grid[ rightTopTileIndex ];

                if ( leftBottomTile === 2 || rightBottomTile === 2 || leftTopTile === 2 || rightTopTile === 2 ) {
                    alert( `¡You won!` );
                    spells.reset();
                }

                if ( leftBottomTile === 3 ) {
                    scene.grid[ leftBottomTileIndex ] = 0;
                    score.add( 100 );
                }
                if ( rightBottomTile === 3 ) {
                    scene.grid[ rightBottomTileIndex ] = 0;
                    score.add( 100 );
                }
                if ( leftTopTile === 3 ) {
                    scene.grid[ leftTopTileIndex ] = 0;
                    score.add( 100 );
                }
                if ( rightTopTile === 3 ) {
                    scene.grid[ rightTopTileIndex ] = 0;
                    score.add( 100 );
                }

                if ( leftBottomTile === 1 || leftTopTile === 1 ) {
                    this.vx.multi( -0.5 );
                    this.accx = 0.0;
                    this.coords.x = blocksToPixels( leftXTile ) + this.coords.w;
                }
                else if ( rightBottomTile === 1 || rightTopTile === 1 ) {
                    this.vx.multi( -0.5 );
                    this.accx = 0.0;
                    this.coords.x = blocksToPixels( rightXTile ) - this.coords.w;
                }

                const bottomYTile = pixelsToBlocks( this.bottom() );
                const bottomXLeftTile = pixelsToBlocks( this.coords.x + 2.0 );
                const bottomXRightTile = pixelsToBlocks( this.right() - 2.0 );
                const bottomLeftTile = scene.grid[ scene.index( bottomXLeftTile, bottomYTile ) ];
                const bottomRightTile = scene.grid[ scene.index( bottomXRightTile, bottomYTile ) ];
                if ( bottomLeftTile === 1 || bottomRightTile === 1 ) {
                    this.vy.set( 0.0 );
                    this.accy = 0.0;
                    this.coords.y = blocksToPixels( bottomYTile ) - this.coords.h;
                    this.state = `ground`;
                }
                const topYTile = pixelsToBlocks( this.coords.y );
                const topLeftTile = scene.grid[ scene.index( bottomXLeftTile, topYTile ) ];
                const topRightTile = scene.grid[ scene.index( bottomXRightTile, topYTile ) ];
                if ( topLeftTile === 1 || topRightTile === 1 ) {
                    this.vy.multi( -0.5 );
                    this.accy = 0.0;
                    this.coords.y = blocksToPixels( topYTile ) + this.coords.h;
                }

                if ( this.state === `ground` ) {
                    if ( input.held( `up` ) ) {
                        if ( !this.jumpLock ) {
                            this.state = `jump`;
                        }
                    }
                    else {
                        this.jumpLock = false;
                    }
                }
                else {
                    this.jumpLock = true;
                }
            }
        };
    };

    const createCounter = function( elementId, start, max, min ) {
        const number = createLimitedNumber( start, max, min );
        const numberShown = createLimitedNumber( start, max, min );
        const counter = document.getElementById( elementId );
        const updateCounter = function() {
            counter.innerHTML = number.get();
        };
        updateCounter();
        return {
            update: function() {
                if ( numberShown.get() < number.get() ) {
                    numberShown.add( 25 );
                    if ( numberShown.get() > number.get() ) {
                        numberShown.set( number.get() );
                    }
                    updateCounter();
                }
                else if ( numberShown.get() > number.get() ) {
                    numberShown.sub( 25 );
                    if ( numberShown.get() < number.get() ) {
                        numberShown.set( number.get() );
                    }
                    updateCounter();
                }
            },
            add: function( amount ) {
                number.add( amount );
            },
            sub: function( amount ) {
                number.sub( amount );
            },
            testSub: function( amount ) {
                return number.testSub( amount );
            },
            reset: function() {
                number.set( start );
                numberShown.set( start );
                updateCounter();
            }
        };
    };

    const score = createCounter( `nasrin-score`, 0, 99999, 0 );
    const magic = createCounter( `nasrin-magic`, 30, 30, 0 );

    let player = createPlayer();
    let scene = createScene();

    const update = function() {
        player.update();
        clearCanvas();
        colorCanvas( `#000` );
        scene.render();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba( 0, 0, 255, 0.5 )`;
        for ( let y = 0; y < canvasHeightPixels; y += blockSize ) {
            ctx.beginPath();
            ctx.moveTo( 0, y );
            ctx.lineTo( canvasWidthPixels, y );
            ctx.stroke();
        }
        for ( let x = 0; x < canvasWidthPixels; x += blockSize ) {
            ctx.beginPath();
            ctx.moveTo( x, 0 );
            ctx.lineTo( x, canvasHeightPixels );
            ctx.stroke();
        }
        renderObject( player );
        score.update();
        magic.update();
        window.requestAnimationFrame( update );
    };
    window.requestAnimationFrame( update );


    const changeGrid = function( value, args ) {
        if ( args.length < 2 ) {
            throw `¡Now ’nough arguments for block spell! ¡You need 2 #s!`;
        }
        let x = Math.floor( args[ 0 ] );
        let y = Math.floor( args[ 1 ] );
        let width = 1;
        let height = 1;
        if ( args.length > 3 ) {
            height = Math.floor( args[ 3 ] );
        }
        if ( args.length > 2 ) {
            width = Math.floor( args[ 2 ] );
        }
        const right = x + width;
        const bottom = y + height;
        const orig_x = x;
        while ( y < bottom ) {
            x = orig_x;
            while ( x < right ) {
                scene.grid[ scene.index( x, y ) ] = value;
                ++x;
            }
            ++y;
        }
    };

    const spells = {
        block: ( args ) => {
            changeGrid( 1, args );
        },
        hole: ( args ) => {
            changeGrid( 0, args );
        },
        rand: ( args ) => {
            let min = 0;
            let max = 1;
            if ( args.length > 1 ) {
                min = Math.ceil( args[ 1 ] );
            }
            if ( args.length > 0 ) {
                max = Math.floor( args[ 0 ] );
            }
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        reset: () => {
            player = createPlayer();
            scene = createScene();
            score.reset();
            magic.reset();
        }
    };

    const doSpell = function( action ) {
        const spell = action[ 0 ];
        if ( !spells.hasOwnProperty( spell ) )
        {
            throw `Invalid spell: ${ spell }`;
        }
        const args = [];
        for ( let i = 1; i < action.length; ++i )
        {
            if ( typeof action[ i ] === `object` )
            {
                args.push( doSpell( action[ i ] ) );
            }
            else
            {
                args.push( action[ i ] );
            }
        }
        return spells[ spell ]( args );
    };

    document.getElementById( `nasrin-submit` ).addEventListener( `click`, function( e ) {
        const content = document.getElementById( `nasrin-input` ).value;
        const notEnoughMagic = !magic.testSub( content.length );
        if ( !notEnoughMagic ) {
            magic.sub( content.length );
        }
        let data = "";
        let status = "";
        for ( const character of content )
        {
            if ( character === `(` )
            {
                if ( status === `name` )
                {
                    status = ``;
                    data += `"`;
                }
                data += `[`;
            }
            else if ( character === `)` )
            {
                if ( status === `name` )
                {
                    status = ``;
                    data += `"`;
                }
                data += `]`;
            }
            else if ( character.match( /\s/ ) )
            {
                if ( status === `name` )
                {
                    status = ``;
                    data += `"`;
                }
                data += `, `;
            }
            else
            {
                if ( status === `name` )
                {
                    data += character;
                }
                else
                {
                    data += `"${ character }`;
                    status = `name`;
                }
            }
        }
        data = JSON.parse( `{ "data": [${ data }]}` );
        for ( const action of data.data )
        {
            if ( !notEnoughMagic || action[ 0 ] === `reset` ) {
                doSpell( action );
            }
        }
    });
})();