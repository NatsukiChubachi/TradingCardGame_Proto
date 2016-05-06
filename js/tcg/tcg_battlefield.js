/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _gTcgBattleField = {
    OwnerNumber: {
        iNoneState: -1,
        iPlayerA: 0,
        iPlayerB: 1
    },
    TurnState: {
        iNoneState: -1,
        iBattleStart: 0,
        iRefreshState: 1,
        iDrawState: 2,
        iMainState: 3,
        iBattleState: 4,
        iEndState: 5
    },
    CardChip: {
        iSizeX: 40,
        iSizeY: 60
    }
};

// TCG戦場クラス
var CTcgBattleField = function() {
    
    // 初期化処理
    this.initialize = function( _game ) 
    {
        // シーン作成
        this._game = _game;
        this._scene = new Scene();
        
        // 背景色
        this._scene.backgroundColor = "#999999";
        
        // ラベル作成
        this._lblPage = this.createLabel( 10, 10, "TCG BattleField Page." );
        this._lblPage.font = "32px cursive";

        // 作成したシーンを追加する
        this._game.pushScene( this._scene );
        
        // カードチップの試作
        this._lblLifeA = this.createLabel( 10, 450, "Player_A Life = 20" );
        this._lblLifeB = this.createLabel( 10, 470, "Player_B Life = 20" );
        
        // ターン制御変数
        this._iOwnerState = _gTcgBattleField.OwnerNumber.iPlayerA;
        this._iTurnState  = _gTcgBattleField.TurnState.iBattleStart;
        this._bStateMove = false;
        
        // 毎ループ判定処理
        this._lblManager = this.createLabel( 0, 0, "!" );
        this._lblManager._parent = this;
        this._lblManager.addEventListener("enterframe", function(){

            switch( this._parent._iTurnState )
            {
            case _gTcgBattleField.TurnState.iBattleStart:
                alert("BattleStart");
                this._parent._iTurnState = _gTcgBattleField.TurnState.iRefreshState;
                break;
            case _gTcgBattleField.TurnState.iRefreshState:
                if ( this._parent._bStateMove )
                {
                    alert("RefreshState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iDrawState;
                    this._parent._bStateMove = false;
                }
                break;
            case _gTcgBattleField.TurnState.iDrawState:
                if ( this._parent._bStateMove )
                {
                    alert("DrawState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iMainState;
                    this._parent._bStateMove = false;
                }
                break;
            case _gTcgBattleField.TurnState.iMainState:
                if ( this._parent._bStateMove )
                {
                    alert("MainState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iBattleState;
                    this._parent._bStateMove = false;
                }
                break;
            case _gTcgBattleField.TurnState.iBattleState:
                if ( this._parent._bStateMove )
                {
                    alert("BattleState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iEndState;
                    this._parent._bStateMove = false;
                }
                break;
            case _gTcgBattleField.TurnState.iEndState:
                if ( this._parent._bStateMove )
                {
                    alert("EndState");
                    this._parent._iTurnState = _gTcgBattleField.TurnState.iRefreshState;
                    this._parent._bStateMove = false;
                    
                    if ( this._parent._iOwnerState === _gTcgBattleField.OwnerNumber.iPlayerA )
                    {
                        this._parent._iOwnerState = _gTcgBattleField.OwnerNumber.iPlayerB;
                    }
                    else
                    {
                        this._parent._iOwnerState = _gTcgBattleField.OwnerNumber.iPlayerA;
                    }
                }
                break;
            };
            
        });
        
        // ターン状態表示ラベル
        this._lblTurnState = this.createLabel( 250, 450, "TurnState: " );
        this._lblTurnState._parent = this;
        this._lblTurnState.addEventListener("enterframe", function() {
            var sTmp = "TurnState: ";
            
            switch( this._parent._iOwnerState )
            {
            case _gTcgBattleField.OwnerNumber.iPlayerA:
                sTmp += "PlayerA, ";
                break;
            case _gTcgBattleField.OwnerNumber.iPlayerB:
                sTmp += "PlayerB, ";
                break;
            };
            
            switch( this._parent._iTurnState )
            {
            case _gTcgBattleField.TurnState.iBattleStart:
                sTmp += "BattleStart";
                break;
            case _gTcgBattleField.TurnState.iRefreshState:
                sTmp += "RefreshState";
                break;
            case _gTcgBattleField.TurnState.iDrawState:
                sTmp += "DrawState";
                break;
            case _gTcgBattleField.TurnState.iMainState:
                sTmp += "MainState";
                break;
            case _gTcgBattleField.TurnState.iBattleState:
                sTmp += "BattleState";
                break;
            case _gTcgBattleField.TurnState.iEndState:
                sTmp += "EndState";
                break;
            };
            
            this.text = sTmp;
        } );
        
        // テンポラリ変数
        var tmp;
        
        // Player_A 手札
        this.createChip( 100, 370 );
        this.createChip( 150, 370 );
        this.createChip( 200, 370 );
        this.createChip( 250, 370 );
        tmp = this.createChip( 300, 370 );
        tmp._parent = this;
        tmp.addEventListener("touchstart", function() {
          // alert("AAA");
          this.y += 1;
          this._parent._bStateMove = true;
        });
        
        // Player_A 場
        this.createChip( 100, 260 );
        this.createChip( 150, 260 );
        this.createChip( 200, 260 );
        
        // Player_A 山札
        this.createChip( 430, 250 );
        this.createChip( 435, 255 );
        this.createChip( 440, 260 );

        // Player_A 捨て山
        this.createChip( 430, 350 );
        
        // Player_A プレイヤー情報
        this.createChip( 10, 250 );
        this.createChip( 10, 300 );
        this.createChip( 10, 350 );
        
        
        // Player_B 手札
        this.createChip( 100, 120 - 60 );
        this.createChip( 150, 120 - 60 );
        this.createChip( 200, 120 - 60 );
        this.createChip( 250, 120 - 60 );
        this.createChip( 300, 120 - 60 );
        
        // Player_B 場
        this.createChip( 300, 240 - 60 );
        this.createChip( 250, 240 - 60 );
        this.createChip( 200, 240 - 60 );
        
        // Player_B 山札
        this.createChip( 30, 250 - 60 );
        this.createChip( 35, 245 - 60 );
        this.createChip( 40, 240 - 60 );

        // Player_B 捨て山
        this.createChip( 30, 150 - 60 );
        
        // Player_B プレイヤー情報
        this.createChip( 410, 250 - 60 );
        this.createChip( 410, 200 - 60 );
        this.createChip( 410, 150 - 60 );
        
    };
    
    // ラベルの作成
    this.createLabel = function(iPosX, iPosY, sStrMsg)
    {
        // ラベル作成
        var lbl = new Label( sStrMsg );
        lbl.x = iPosX;
        lbl.y = iPosY;
        lbl.font = "16px cursive";
        lbl.textAlign = "left";
        
        this._scene.addChild( lbl );
        return lbl;
    };
    
    // カードチップの作成
    this.createChip = function( iPosX, iPosY ) 
    {
        var iSizeX = _gTcgBattleField.CardChip.iSizeX;
        var iSizeY = _gTcgBattleField.CardChip.iSizeY;

        var _field = new Sprite(iSizeX, iSizeY);
        
        {
            var surf = new Surface(iSizeX, iSizeY);
            surf.context.beginPath();
            surf.context.fillStyle = "rgba(255,0,0,0.5)";
            surf.context.rect(0, 0, iSizeX, iSizeY);
            //surf.context.fillRect(0, 0, iSizeX, iSizeY);
            surf.context.stroke();
            _field.image = surf;

            _field.x = iPosX;
            _field.y = iPosY;
        }
        
        this._scene.addChild( _field );
        
        return _field;
    };
    
    return this;
};


