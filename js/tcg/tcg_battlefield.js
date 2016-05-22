var _gManage = null;

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
        this._params._scene = this._scene;
        this._params._iOwnerState = CTcgBattleField.OwnerNumber.iPlayerA;
        this._params._iTurnState  = CTcgBattleField.TurnState.iBattleStart_Start;
        this._params._bStateMove = false;
        this._params._SPlayerA_Params = new CTcgBattlePlayerParams( this._scene );
        this._params._SPlayerB_Params = new CTcgBattlePlayerParams( this._scene );

        var tmp = null;

        // エンティティの追加（山札）
        tmp = this._params._SPlayerA_Params._groupCardLibrary;
        tmp.x = 400;
        tmp.y = 220;
        this._scene.addChild( tmp );
        
        // エンティティの追加（捨札）
        tmp = this._params._SPlayerA_Params._groupCardTrash;
        tmp.x = 400;
        tmp.y = 280;
        this._scene.addChild( tmp );
        
        // エンティティの追加（手札）
        tmp = this._params._SPlayerA_Params._groupCardHand;
        tmp.x = 100;
        tmp.y = 400;
        this._scene.addChild( tmp );
        
        // エンティティの追加（コア）
        tmp = this._params._SPlayerA_Params._groupCoreField;
        tmp.x = 400;
        tmp.y = 370;
        this._scene.addChild( tmp );
        
        // エンティティの追加（フィールド）
        tmp = this._params._SPlayerA_Params._groupCardField;
        tmp.x = 100;
        tmp.y = 300;
        this._scene.addChild( tmp );
        
        // エンティティの追加（フィールド）
        tmp = this._params._SPlayerA_Params._groupLifeCounter;
        tmp.x = 50;
        tmp.y = 300;
        this._scene.addChild( tmp );
        
        this._params._SPlayerB_Params._groupCardLibrary.x = 50;
        this._params._SPlayerB_Params._groupCardLibrary.y = 80;
        this._scene.addChild( this._params._SPlayerB_Params._groupCardLibrary );
        
        this._params._SPlayerB_Params._groupCardHand.x = 100;
        this._params._SPlayerB_Params._groupCardHand.y = 50;
        this._scene.addChild( this._params._SPlayerB_Params._groupCardHand );
        
        // カードチップの試作
        this._lblLifeA = this.CreateLabel( 10, 450, "Player_A Life = " + this._params._SPlayerA_Params._iLife_Now );
        this._lblLifeB = this.CreateLabel( 10, 470, "Player_B Life = " + this._params._SPlayerB_Params._iLife_Now );

        // ゲームマネージャーの作成
        this._manager = _gCommon.CreateGroup( -100, -100 );
        this._manager._params = this._params;
        this._scene.addChild( this._manager );
        
        _gManage = this._manager;
        _gManage._params._scene = this._scene;
        _gManage._params._bOpenCard = false;
        
        // マネージャ処理
        // 毎ループ判定処理
        this._manager.addEventListener("enterframe", function()
        {
            var _tmp;
            var _params = this._params;
            
            switch( _params._iTurnState )
            {
                // 対戦開始ステート
                /**
                 * 対戦開始ステート
                 * このステート開始時にプレイヤーの場（山札、手札、捨札）は初期化される
                 * 山札はシャッフルされ、そこから手札が配布される
                 * 
                 * 先攻となるプレイヤーがオーナーとなり、リフレッシュステートからスタートする
                 * 初めのターンではドローステートで山札からカードをドロー出来ない
                 */
            case CTcgBattleField.TurnState.iBattleStart_Start:
                {
                    // ターンステート表記ラベル
                    _tmp = _gCommon.CreateLabel( -100, -100, "BattleStart" );
                    _tmp._params = {};
                    _tmp._params._scene = _params._scene;
                    _tmp._params._manager = this;
                    _tmp.tl.clear();
                    _tmp.tl.moveTo( -100, 200, 0 )
                            .moveTo( 250, 200, 30 )
                            .delay( 90 )
                            .moveTo( 500, 200, 30 )
                            .then(function(){
                                this._params._scene.removeChild( this );

                                // 次のステートに進む
                                var _manager = this._params._manager;
                                _manager._params._iTurnState = CTcgBattleField.TurnState.iRefreshState_Start;
                            });
                    _params._scene.addChild( _tmp );

                    _params._iTurnState = CTcgBattleField.TurnState.iRefreshState_End;
                }
                break;
            case CTcgBattleField.TurnState.iBattleStart_End:
                break;

                /**
                 * リフレッシュステート
                 * このステート開始時にスピリット（仮称）は回復する（行動可能になる）
                 * このステート開始時にコア（仮称）はリザーブに置かれ使用可能となる
                 * このステート開始時に山札の残り枚数をチェックし、0枚なら負けとなる
                 * 
                 * このステートをトリガーとして効果を発揮するカードが存在する
                 */
            case CTcgBattleField.TurnState.iRefreshState_Start:
                {
                    // ターンステート表記ラベル
                    _tmp = _gCommon.CreateLabel( -100, -100, "RefreshState" );
                    _tmp._params = {};
                    _tmp._params._scene = _params._scene;
                    _tmp.tl.clear();
                    _tmp.tl.moveTo( -100, 200, 0 )
                            .moveTo( 250, 200, 30 )
                            .delay( 90 )
                            .moveTo( 500, 200, 30 )
                            .then(function(){
                                this._params._scene.removeChild( this );
                            });
                    _params._scene.addChild( _tmp );

                    // リフレッシュ処理
                    
                    // 次のステートに進む
                    _params._iTurnState = CTcgBattleField.TurnState.iRefreshState_End;
                    _params._bStateMove = false;
                }
                break;
            case CTcgBattleField.TurnState.iRefreshState_End:
                if ( this._params._bStateMove )
                {
                    // 次のステートに進む
                    _params._iTurnState = CTcgBattleField.TurnState.iDrawState_Start;
                    _params._bStateMove = false;
                }
                break;

                /**
                 * ドローステート
                 * このステートの開始時に山札からカードを一枚引く
                 * 
                 * このステートをトリガーとして効果を発揮するカードが存在する
                 */
            case CTcgBattleField.TurnState.iDrawState_Start:
                {
                    // ターンステート表記ラベル
                    _tmp = _gCommon.CreateLabel( -100, -100, "DrawState" );
                    _tmp._params = {};
                    _tmp._params._scene = _params._scene;
                    _tmp.tl.clear();
                    _tmp.tl.moveTo( -100, 200, 0 )
                            .moveTo( 250, 200, 30 )
                            .delay( 90 )
                            .moveTo( 500, 200, 30 )
                            .then(function(){
                                this._params._scene.removeChild( this );
                            });
                    _params._scene.addChild( _tmp );

                    // 山札からカードを一枚引く
                    /*
                    this._params._SPlayerA_Params.PicCardFromLibrary();
                    this._params._SPlayerA_Params.ReplaceCardHand();
                            */
                    if ( _params._iOwnerState === CTcgBattleField.OwnerNumber.iPlayerA )
                    {
                        this._params._SPlayerA_Params.PicCardFromLibrary();
                        this._params._SPlayerA_Params.ReplaceCardHand();
                    }
                    else
                    {
                        this._params._SPlayerB_Params.PicCardFromLibrary();
                        this._params._SPlayerB_Params.ReplaceCardHand();
                    }
                    
                    // 次のステートに進む
                    _params._iTurnState = CTcgBattleField.TurnState.iDrawState_End;
                    _params._bStateMove = false;
                }
                break;
                
            case CTcgBattleField.TurnState.iDrawState_End:
                if ( this._params._bStateMove )
                {
                    // 次のステートに進む
                    _params._iTurnState = CTcgBattleField.TurnState.iMainState_Start;
                    _params._bStateMove = false;
                }
                break;

                /**
                 * メインステート
                 * このステート中オーナーのプレイヤーはコアを消費して手札／場から以下の操作を行うことができる
                 *   スピリットの召喚
                 *   アーティファクトの配置
                 *   場に置かれたスピリット／アーティファクトの効果発揮
                 *   マジックの使用
                 * このステートはプレイヤーの任意のタイミングで終了できる
                 * 
                 * このステートをトリガーとして効果を発揮するカードが存在する
                 */
            case CTcgBattleField.TurnState.iMainState_Start:
                {
                    // ターンステート表記ラベル
                    _tmp = _gCommon.CreateLabel( -100, -100, "MainState" );
                    _tmp._params = {};
                    _tmp._params._scene = _params._scene;
                    _tmp.tl.clear();
                    _tmp.tl.moveTo( -100, 200, 0 )
                            .moveTo( 250, 200, 30 )
                            .delay( 90 )
                            .moveTo( 500, 200, 30 )
                            .then(function(){
                                this._params._scene.removeChild( this );
                            });
                    _params._scene.addChild( _tmp );
                    
                    // 次のステートに進む
                    _params._iTurnState = CTcgBattleField.TurnState.iMainState_End;
                    _params._bStateMove = false;
                }
                break;
                
            case CTcgBattleField.TurnState.iMainState_End:
                if ( this._params._bStateMove )
                {
                    // 次のステートに進む
                    _params._iTurnState = CTcgBattleField.TurnState.iBattleState_Start;
                    _params._bStateMove = false;
                }
                break;
            
                /**
                 * バトルステート
                 * このステート中オーナーとなるプレイヤーは以下の操作を行うことができる
                 * 　スピリットによるアタック
                 * 　コアを消費してマジックを使用する
                 * 
                 * このステートをトリガーとして効果を発揮するカードが存在する
                 */
            case CTcgBattleField.TurnState.iBattleState_Start:
                {
                    // ターンステート表記ラベル
                    _tmp = _gCommon.CreateLabel( -100, -100, "BattleState" );
                    _tmp._params = {};
                    _tmp._params._scene = _params._scene;
                    _tmp.tl.clear();
                    _tmp.tl.moveTo( -100, 200, 0 )
                            .moveTo( 250, 200, 30 )
                            .delay( 90 )
                            .moveTo( 500, 200, 30 )
                            .then(function(){
                                this._params._scene.removeChild( this );
                            });
                    _params._scene.addChild( _tmp );
                                
                    // 次のステートに進む        
                    _params._iTurnState = CTcgBattleField.TurnState.iBattleState_End;
                    _params._bStateMove = false;
                }
                break;
            case CTcgBattleField.TurnState.iBattleState_End:
                 if ( this._params._bStateMove )
                 {
                    // 次のステートに進む        
                    _params._iTurnState = CTcgBattleField.TurnState.iEndState;
                    _params._bStateMove = false;
                }
                break;

                // エンドステート
                /**
                 * エンドステート
                 * このステートを通過後、オーナーのプレイヤーを交代する。
                 * 交代後はリフレッシュステートに移行する
                 * 
                 * このステートをトリガーとして効果を発揮するカードが存在する
                 */
            case CTcgBattleField.TurnState.iEndState:
                if ( this._params._bStateMove )
                {
                    // ターンステート表記ラベル
                    _tmp = _gCommon.CreateLabel( -100, -100, "EndState" );
                    _tmp._params = {};
                    _tmp._params._scene = _params._scene;
                    _tmp.tl.clear();
                    _tmp.tl.moveTo( -100, 200, 0 )
                            .moveTo( 250, 200, 30 )
                            .delay( 90 )
                            .moveTo( 500, 200, 30 )
                            .then(function(){
                                this._params._scene.removeChild( this );
                            });
                    _params._scene.addChild( _tmp );
                                      
                    // 次のステートに進む
                    _params._iTurnState = CTcgBattleField.TurnState.iRefreshState_Start;
                    _params._bStateMove = false;
                    
                    if ( _params._iOwnerState === CTcgBattleField.OwnerNumber.iPlayerA )
                    {
                        _params._iOwnerState = CTcgBattleField.OwnerNumber.iPlayerB;
                    }
                    else
                    {
                        _params._iOwnerState = CTcgBattleField.OwnerNumber.iPlayerA;
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
            case CTcgBattleField.TurnState.iBattleStart_Start:
            case CTcgBattleField.TurnState.iBattleStart_End:
                sTmp += "BattleStart";
                break;
            case CTcgBattleField.TurnState.iRefreshState_Start:
            case CTcgBattleField.TurnState.iRefreshState_End:
                sTmp += "RefreshState";
                break;
            case CTcgBattleField.TurnState.iDrawState_Start:
            case CTcgBattleField.TurnState.iDrawState_End:
                sTmp += "DrawState";
                break;
            case CTcgBattleField.TurnState.iMainState_Start:
            case CTcgBattleField.TurnState.iMainState_End:
                sTmp += "MainState";
                break;
            case CTcgBattleField.TurnState.iBattleState_Start:
            case CTcgBattleField.TurnState.iBattleState_End:
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
       
        tmp = this.CreateChip( 450, 200 );
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
  iBattleStart_Start: 0,
  iBattleStart_End: 1,
  iRefreshState_Start: 2,
  iRefreshState_End: 3,
  iDrawState_Start: 4,
  iDrawState_End: 5,
  iMainState_Start: 6,
  iMainState_End: 7,
  iBattleState_Start: 8,
  iBattleState_End: 9,
  iEndState: 10
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


