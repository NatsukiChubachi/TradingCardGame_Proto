
/**
 * TCG戦場クラス 
 * @returns {CTcgBattleField}
 */
var CTcgBattleField = function()
{
    /**
     * 初期化処理 
     * @param {type} _game
     * @returns {undefined}
     */
    this.initialize = function( _game ) 
    {
        // シーン作成
        this._game = _game;
        this._scene = new Scene();
        
        // 背景色
        this._scene.backgroundColor = "#FFFFFF";
        
        // 作成したシーンを追加する
        this._game.pushScene( this._scene );
        
        // ターン制御変数
        this._params = {};
        this._params._iOwnerState = CTcgBattleField.OwnerNumber.iPlayerA;
        this._params._iTurnState  = CTcgBattleField.TurnState.iBattleStart;
        this._params._bStateMove = false;
        this._params._SPlayerA_Params = new CTcgBattlePlayerParams();
        this._params._SPlayerB_Params = new CTcgBattlePlayerParams();

        this._params._SPlayerA_Params._groupCardLibrary.x = 400;
        this._params._SPlayerA_Params._groupCardLibrary.y = 360;
        this._scene.addChild( this._params._SPlayerA_Params._groupCardLibrary );
        
        this._params._SPlayerA_Params._groupCardHand.x = 100;
        this._params._SPlayerA_Params._groupCardHand.y = 400;
        this._scene.addChild( this._params._SPlayerA_Params._groupCardHand );
        
        // カードチップの試作
        this._lblLifeA = this.CreateLabel( 10, 450, "Player_A Life = " + this._params._SPlayerA_Params._iLife_Now );
        this._lblLifeB = this.CreateLabel( 10, 470, "Player_B Life = " + this._params._SPlayerB_Params._iLife_Now );
        
        // 毎ループ判定処理
        this._lblManager = this.CreateLabel( 0, 0, "" );
        this._lblManager._params = this._params;
        this._lblManager.addEventListener("enterframe", function()
        {
            switch( this._params._iTurnState )
            {
            case CTcgBattleField.TurnState.iBattleStart:
                alert("BattleStart");
                this._params._iTurnState = CTcgBattleField.TurnState.iRefreshState;
                break;
            case CTcgBattleField.TurnState.iRefreshState:
                if ( this._params._bStateMove )
                {
                    alert("RefreshState");
                    this._params._iTurnState = CTcgBattleField.TurnState.iDrawState;
                    this._params._bStateMove = false;
                }
                break;
            case CTcgBattleField.TurnState.iDrawState:
                if ( this._params._bStateMove )
                {
                    alert("DrawState");
                    this._params._iTurnState = CTcgBattleField.TurnState.iMainState;
                    this._params._bStateMove = false;
                }
                break;
            case CTcgBattleField.TurnState.iMainState:
                if ( this._params._bStateMove )
                {
                    alert("MainState");
                    this._params._iTurnState = CTcgBattleField.TurnState.iBattleState;
                    this._params._bStateMove = false;
                }
                break;
            case CTcgBattleField.TurnState.iBattleState:
                if ( this._params._bStateMove )
                {
                    alert("BattleState");
                    this._params._iTurnState = CTcgBattleField.TurnState.iEndState;
                    this._params._bStateMove = false;
                }
                break;
            case CTcgBattleField.TurnState.iEndState:
                if ( this._params._bStateMove )
                {
                    alert("EndState");
                    this._params._iTurnState = CTcgBattleField.TurnState.iRefreshState;
                    this._params._bStateMove = false;
                    
                    if ( this._params._iOwnerState === CTcgBattleField.OwnerNumber.iPlayerA )
                    {
                        this._params._iOwnerState = CTcgBattleField.OwnerNumber.iPlayerB;
                    }
                    else
                    {
                        this._params._iOwnerState = CTcgBattleField.OwnerNumber.iPlayerA;
                    }
                }
                break;
            };
            
        });
        
        // ターン状態表示ラベル
        this._lblTurnState = this.CreateLabel( 200, 450, "TurnState: " );
        this._lblTurnState._params = this._params;
        this._lblTurnState.addEventListener("enterframe", function() 
        {
            var sTmp = "TurnState: ";
            
            switch( this._params._iOwnerState )
            {
            case CTcgBattleField.OwnerNumber.iPlayerA:
                sTmp += "PlayerA, ";
                break;
            case CTcgBattleField.OwnerNumber.iPlayerB:
                sTmp += "PlayerB, ";
                break;
            };
            
            switch( this._params._iTurnState )
            {
            case CTcgBattleField.TurnState.iBattleStart:
                sTmp += "BattleStart";
                break;
            case CTcgBattleField.TurnState.iRefreshState:
                sTmp += "RefreshState";
                break;
            case CTcgBattleField.TurnState.iDrawState:
                sTmp += "DrawState";
                break;
            case CTcgBattleField.TurnState.iMainState:
                sTmp += "MainState";
                break;
            case CTcgBattleField.TurnState.iBattleState:
                sTmp += "BattleState";
                break;
            case CTcgBattleField.TurnState.iEndState:
                sTmp += "EndState";
                break;
            };
            
            this.text = sTmp;
        } );
        
        // テンポラリ変数
        var tmp;
        
        /*
        // Player_A 手札
        this.CreateChip( 100, 370 );
        this.CreateChip( 150, 370 );
        this.CreateChip( 200, 370 );
        this.CreateChip( 250, 370 );
        tmp = this.CreateChip( 300, 370 );
        tmp._parent = this;
        tmp.addEventListener("touchstart", function() 
        {
          this.y += 1;
          this._parent._bStateMove = true;
        });
        
        // Player_A 場
        this.CreateChip( 100, 260 );
        this.CreateChip( 150, 260 );
        this.CreateChip( 200, 260 );
        
        // Player_A 山札
        this.CreateChip( 430, 250 );
        this.CreateChip( 435, 255 );
        this.CreateChip( 440, 260 );

        // Player_A 捨て山
        this.CreateChip( 430, 350 );
       
        // Player_A プレイヤー情報
        this.CreateChip( 10, 250 );
        this.CreateChip( 10, 300 );
        this.CreateChip( 10, 350 );
        
        
        // Player_B 手札
        this.CreateChip( 100, 120 - 60 );
        this.CreateChip( 150, 120 - 60 );
        this.CreateChip( 200, 120 - 60 );
        this.CreateChip( 250, 120 - 60 );
        this.CreateChip( 300, 120 - 60 );
        
        // Player_B 場
        this.CreateChip( 300, 240 - 60 );
        this.CreateChip( 250, 240 - 60 );
        this.CreateChip( 200, 240 - 60 );
        
        // Player_B 山札
        this.CreateChip( 30, 250 - 60 );
        this.CreateChip( 35, 245 - 60 );
        this.CreateChip( 40, 240 - 60 );

        // Player_B 捨て山
        this.CreateChip( 30, 150 - 60 );
        
        // Player_B プレイヤー情報
        this.CreateChip( 410, 250 - 60 );
        this.CreateChip( 410, 200 - 60 );
        this.CreateChip( 410, 150 - 60 );
        */
       
        tmp = this.CreateChip( 450, 370 );
        tmp._params = this._params;
        tmp.addEventListener("touchstart", function() 
        {
          this._params._bStateMove = true;
        });
    };
    
    return this;
};

/**
 * 定義：ターンオーナー
 * 現在どちらにターンの主導権があるか？
 */
CTcgBattleField.OwnerNumber = {
  iNoneState: -1,
  iPlayerA: 0,
  iPlayerB: 1    
};
    
/**
 * 定義：ターンステート
 * ターンのどの状態にいるか？
 */
CTcgBattleField.TurnState = {
  iNoneState: -1,
  iBattleStart: 0,
  iRefreshState: 1,
  iDrawState: 2,
  iMainState: 3,
  iBattleState: 4,
  iEndState: 5
};

/**
 * カードチップのサイズ
 * @type type
 */
CTcgBattleField.CardChip = {
    iSizeX: 40,
    iSizeY: 60
};

/**
 * ラベルの作成 
 * @param {type} iPosX
 * @param {type} iPosY
 * @param {type} sStrMsg
 * @returns {Label|CTcgBattleField.CreateLabel.lbl}
 */
CTcgBattleField.prototype.CreateLabel = function( iPosX, iPosY, sStrMsg )
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

/**
 * カードチップの作成 
 * @param {type} iPosX
 * @param {type} iPosY
 * @returns {Sprite|CTcgBattleField.createChip._field}
 */
CTcgBattleField.prototype.CreateChip = function( iPosX, iPosY ) 
{
    var iSizeX = CTcgBattleField.CardChip.iSizeX;
    var iSizeY = CTcgBattleField.CardChip.iSizeY;

    var _field = new Sprite(iSizeX, iSizeY);

    var surf = new Surface(iSizeX, iSizeY);
    surf.context.beginPath();
    surf.context.fillStyle = "rgba(255,0,0,0.5)";
    surf.context.rect(0, 0, iSizeX, iSizeY);
    //surf.context.fillRect(0, 0, iSizeX, iSizeY);
    surf.context.stroke();
    _field.image = surf;

    _field.x = iPosX;
    _field.y = iPosY;

    this._scene.addChild( _field );

    return _field;
};


