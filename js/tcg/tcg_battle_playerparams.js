
var _gCardColorCost = {};
_gCardColorCost = {
    0: "赤",
    1: "青",
    2: "緑",
    3: "黄",
    4: "白",
    5: "黒"
};

var _gCardCategory = {};
_gCardCategory = {
    0: "スピリット",
    1: "マジック",
    2: "エンチャント",
    3: "ブレイヴ"
};

var _gCardData = {};
_gCardData = {
    0: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー0",
        _sText: "テスト用カード0"
    },
    1: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー1",
        _sText: "テスト用カード1"
    },
    2: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー2",
        _sText: "テスト用カード2"
    },
    3: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー3",
        _sText: "テスト用カード3"
    },
    4: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー4",
        _sText: "テスト用カード4"
    },
    5: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー5",
        _sText: "テスト用カード5"
    },
    6: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー6",
        _sText: "テスト用カード6"
    },
    7: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー7",
        _sText: "テスト用カード7"
    },
    8: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー8",
        _sText: "テスト用カード8"
    },
    9: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー9",
        _sText: "テスト用カード9"
    },
    10: {
        _iCategory: 0,
        _iColorCost: [ ],
        _iGrayCost: 1,
        _iLife: 1,
        _iAtk: 1,
        _sName: "ソルジャー10",
        _sText: "テスト用カード10"
    }
};

/**
 * TCGバトルプレイヤーパラメータクラス
 * @returns {CTcgBattlePlayerParams}
 */
var CTcgBattlePlayerParams = function( parent )
{
    // パラメータ
    this._parent = parent;                                  // 追加先親
    this._iLife_Now = 20;                                   // ライフ
    this._iLife_Max = 20;                                   // ライフ
    this._CardLibrary = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];   // ライブラリ（山札）
    this._iRemainLibrary = this._CardLibrary.length;        // 残り山札数
    this._CardHand = [];                                    // 手札
    this._CardTrash = [];                                   // 捨札
    this._CoreReserve = 5;                                  // リザーブコア
    this._CoreTrash = 0;                                    // トラッシュコア
    this._groupCardField = _gCommon.CreateGroup( 0, 0 );    // フィールドオブジェクト
    this._groupCardLibrary = _gCommon.CreateGroup( 0, 0 );  // 山札グループ
    this._groupCardHand = _gCommon.CreateGroup( 0, 0 );     // 手札グループ
    this._groupCardTrash = _gCommon.CreateGroup( 0, 0 );    // 捨札グループ
    this._groupCoreField = _gCommon.CreateGroup( 0, 0 );    // フィールドコア 
    this._groupLifeCounter = _gCommon.CreateGroup( 0, 0 );  // ライフカウンター

    this._lblRemainLibrary = null;
    
    // 山札の初期化
    var _i;
    for ( _i=0; _i<10; _i++ )
    {
      this._CardLibrary[ _i ] = _i;
    }
    
    this.ShuffleLibrary();
    this.InitializeCardLibrary();
    this.InitializeCardTrash();
    this.InitializeCardHand();
    this.InitializeCoreField();
    this.InitializeCardField();
    this.InitializeLifeCounter();
    
    return this;
};

/**
 * 山札のシャッフル処理
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.ShuffleLibrary = function()
{
    // カードを入れ替える
    var _iCount = 100;
    
    for ( var _i = 0; _i < _iCount; _i++ )
    {
        // 入れ替える二か所のインデックスを決定する
        var _iIndexA = Math.floor( Math.random() * this._iRemainLibrary );
        var _iIndexB = Math.floor( Math.random() * this._iRemainLibrary );
        
        if ( _iIndexA === _iIndexB )
        {
            continue;
        }
        
        // 入れ替える二か所のカードを取得する
        var _iCardA = this._CardLibrary[ _iIndexA ];
        var _iCardB = this._CardLibrary[ _iIndexB ];

        // 二か所のカードを入れ替える
        this._CardLibrary[ _iIndexA ] = _iCardB;
        this._CardLibrary[ _iIndexB ] = _iCardA;
    }
};

/**
 * 山札からカードを一枚引く
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.PicCardFromLibrary = function()
{
    // 山札が一枚以上残っているとき
    if ( this._iRemainLibrary >= 1 )
    {
        // 山札からカードを一枚引く
        var _i = this._CardHand.length;

        this._CardHand[ _i ] = this._CardLibrary[ 0 ];                  // 山札の頭を手札に加える
        this._CardLibrary.shift();                                      // 山札の頭を削除する

        this._iRemainLibrary = this._CardLibrary.length;                // 山札の残り枚数を更新する

        // 山札の残り枚数を更新する
        this._lblRemainLibrary.text = "" + this._iRemainLibrary;
    }
        
    // 山札が残り枚数0の場合はグループから削除する
    if ( this._iRemainLibrary <= 0 )
    {
        this._parent.removeChild( this._groupCardLibrary );
    }
    
    // 手札グループに加える
    var _tmpGroup;
    var _img;
    var _tmp;
    var _tmp
    
    _tmpGroup = _gCommon.CreateGroup( -200, 0 );

    _img = _gCommon.CreateSurface( 50, 50 );
    _tmp = _gCommon.CreateSprite( 0, 0, 50, 50, _img );
    _tmpGroup.addChild( _tmp );
    var _tmpSprite = _tmp;

    _tmp = _gCommon.CreateLabel( 0, 0, "" + this._CardHand[ _i ] );
    _tmpGroup.addChild( _tmp );
    
    this._groupCardHand.addChild( _tmpGroup );

    _tmpGroup._params = {};
    _tmpGroup._params._iCardId = this._CardHand[ _i ];

    _tmpSprite._parent = _tmpGroup;
    _tmpSprite._groupCardField = this._groupCardField;
    _tmpSprite.addEventListener("touchstart", function()
    {
        if ( _gManage._params._bOpenCard === true )
        {
            return;
        }
        
        _gManage._params._bOpenCard = true;
        
        // alert("touch card");
        var _parent = this._parent;
        
        var _img, _tmp;
        var _tmpGroup = _gCommon.CreateGroup( 100, -100 );
        
        _img = _gCommon.CreateSurface( 150, 150 );
        _tmp = _gCommon.CreateSprite( 0, 0, 150, 150, _img );
        _tmpGroup.addChild( _tmp );
        var _tmpSprite = _tmp;
        
        var iCardId = _parent._params._iCardId;
        var sName = _gCardData[ iCardId ]._sName;
        var iCategory = _gCardData[ iCardId ]._iCategory;
        var iLife = _gCardData[ iCardId ]._iLife;
        var iAtk = _gCardData[ iCardId ]._iAtk;
        var sText = _gCardData[ iCardId ]._sText;
        var iGrayCost = _gCardData[ iCardId ]._iGrayCost;
        
        _tmp = _gCommon.CreateLabel( 0, 0, "id: " + iCardId );
        _tmpGroup.addChild( _tmp );
        
        _tmp = _gCommon.CreateLabel( 0, 20, "name: " + sName );
        _tmpGroup.addChild( _tmp );
        
        _tmp = _gCommon.CreateLabel( 0, 40, "種別: " + _gCardCategory[ iCategory ] );
        _tmpGroup.addChild( _tmp );
        
        _tmp = _gCommon.CreateLabel( 0, 60, "コスト: " + iGrayCost );
        _tmpGroup.addChild( _tmp );
        
        _tmp = _gCommon.CreateLabel( 0, 80, "" + iAtk + " / " + iLife );
        _tmpGroup.addChild( _tmp );
        
        _tmp = _gCommon.CreateLabel( 0, 100, sText );
        _tmpGroup.addChild( _tmp );
        
        this._groupCardField.addChild( _tmpGroup );
        
        _tmpSprite._params = {};
        _tmpSprite._params._group = _tmpGroup;
        _tmpSprite.addEventListener( "touchstart", function(){
            alert("Close Card");
            _gManage._params._bOpenCard = false;
            
            //_gManage._params._scene.removeChild( this._groupCardField );
        });
    });
};

/**
 * 山札初期化
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.InitializeCardLibrary = function()
{
    // 山札グループに加える
    _tmpGroup = _gCommon.CreateGroup( 0, 0 );
    
    _img = _gCommon.CreateSurface( 50, 50 );
    _tmp = _gCommon.CreateSprite( 0, 0, 50, 50, _img );
    _tmpGroup.addChild( _tmp );
    
    _tmp = _gCommon.CreateLabel( 0, 0, "" + this._iRemainLibrary );
    this._lblRemainLibrary = _tmp;
    _tmpGroup.addChild( _tmp );
    
    this._groupCardLibrary.addChild( _tmpGroup );
};

/**
 * 手札初期化
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.InitializeCardHand = function()
{
    // 規定枚数を手札に加える
    var _iCount = 4;

    for ( var _i=0; _i<_iCount; _i++ )
    {
        // 山札からカードを一枚引く
        this.PicCardFromLibrary();
    }
    
    // 手札の配置位置を揃える
    this.ReplaceCardHand();
    
};

/**
 * 手札カードの再配置
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.ReplaceCardHand = function()
{
    var _tmp;
    
    var iCount = this._groupCardHand.childNodes.length;
    for ( var i = 0; i < iCount; i++ )
    {
        _tmp = this._groupCardHand.childNodes[i];
        _tmp.tl.clear();
        
        _tmp.tl.delay(i*5).moveTo( i*(300/iCount), 0, 15 );
    }
};

/**
 * コア初期化
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.InitializeCoreField = function()
{
    var iCount = this._CoreReserve;
    var tmp;
    var img;
    
    for ( var i = 0; i < iCount; i++ )
    {
        img = _gCommon.CreateSurface( 16, 16 );
        tmp = _gCommon.CreateSprite( (20*i), (20), 16, 16, img );
        this._groupCoreField.addChild( tmp );
    }
};

/**
 * カードフィールド初期化
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.InitializeCardField = function()
{
    var tmp = null;

    var img = _gCommon.CreateSurface( 280, 80 );
    
    tmp = _gCommon.CreateSprite( 0, 0, 280, 80, img );
    this._groupCardField.addChild( tmp );
    
    tmp = _gCommon.CreateLabel( 0, 0, "CardField" );
    this._groupCardField.addChild( tmp );
};

/**
 * 捨て札初期化
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.InitializeCardTrash = function()
{
    var img = _gCommon.CreateSurface( 60, 60 );
    var tmp = null;

    tmp = _gCommon.CreateSprite( 0, 0, 60, 60, img );
    this._groupCardTrash.addChild( tmp );
    
    tmp = _gCommon.CreateLabel( 0, 0, "CardTrash" );
    this._groupCardTrash.addChild( tmp );
};

/**
 * プレイヤーライフ表示初期化
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.InitializeLifeCounter = function()
{
    var tmp = null;
    var img = _gCommon.CreateSurface( 40, 40 );
    
    tmp = _gCommon.CreateSprite( 0, 0, 40, 40, img );
    this._groupLifeCounter.addChild( tmp );
    
    tmp = _gCommon.CreateLabel( 0, 0, "Life: " );
    this._groupLifeCounter.addChild( tmp );

    tmp = _gCommon.CreateLabel( 0, 20, this._iLife_Now );
    this._groupLifeCounter.addChild( tmp );
    this._groupLifeCounter._lblLife = tmp;
    
};







