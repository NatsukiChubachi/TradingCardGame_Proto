
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
    this._groupCoreTrash = _gCommon.CreateGroup( 0, 0 );    // トラッシュコア
    this._PicCardObject = null;                             // 選択カードIndex
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
    _tmpGroup._sprite = _tmp;
    var _tmpSprite = _tmp;

    _tmp = _gCommon.CreateLabel( 0, 0, "" + this._CardHand[ _i ] );
    _tmpGroup.addChild( _tmp );
    
    this._groupCardHand.addChild( _tmpGroup );

    _tmpGroup._params = {};
    _tmpGroup._params._owner = this;
    _tmpGroup._params._iCardId = this._CardHand[ _i ];

    // カードクリック時のイベント処理
    _tmpSprite._parent = _tmpGroup;
    _tmpSprite._groupCardField = this._groupCardField;
    _tmpSprite.addEventListener("touchstart", function()
    {
        // マネージャクラスがカードオープンを行うかどうかを判断する
        if ( _gManage._params._bOpenCard === true ) return;
        _gManage._params._bOpenCard = true;

        // 選択したカードオブジェクトを取得する
        this._parent._params._owner._PicCardObject = this._parent;
        
        var _parent = this._parent;
        var _img, _tmp;
        var _tmpGroup = _gCommon.CreateGroup( -50, -100 );
        
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
        
        // 開かれたカードを再度クリックで閉じるようにする
        _tmpSprite._params = {};
        _tmpSprite._params._group = _tmpGroup;
        _tmpSprite._params._parent = this._groupCardField;
        _tmpSprite.addEventListener( "touchstart", function(){
            //alert("Close Card");
            _gManage._params._bOpenCard = false;
            this._params._parent.removeChild( this._params._group );
        });
        
        // todo: 状況によって選択できるかどうか変化する？
        var _iPosX = 170;
        var _iPosY = 10;
        
        // 「場に出す」ボタン
        if ( _gManage._params._iTurnState === CTcgBattleField.TurnState.iMainState_End &&
                iGrayCost <= this._parent._params._owner._CoreReserve
                )
        {
            // コストが足りている場合のみ
            
            // 「場に出す」ボタン
            _tmpSprite = _gCommon.CreateSprite( _iPosX, _iPosY, 50, 30, _gCommon.CreateSurface( 50, 50 ) )
            _tmpSprite._params = {};
            _tmpSprite._params._group = _tmpGroup;
            _tmpSprite._params._parent = this._groupCardField;
            _tmpSprite._params._owner = this._parent._params._owner;
            _tmpGroup.addChild( _tmpSprite );
            
            _tmp = _gCommon.CreateLabel( _tmpSprite.x + 5, _tmpSprite.y + 5, "場に出す" );
            _tmp._params = _tmpSprite._params;
            _tmpGroup.addChild( _tmp );
            
            var _func = function() {
                
                var _groupCardHand = this._params._owner._groupCardHand;
                var _groupCardField = this._params._owner._groupCardField;
                var _groupCoreField = this._params._owner._groupCoreField;
                var _groupCoreTrash = this._params._owner._groupCoreTrash;

                // コアの消費
                var _targetCore = _groupCoreField.childNodes[0];
                _groupCoreTrash.addChild( _targetCore );
                _groupCoreField.removeChild( _targetCore );
                //_groupCoreField.removeChild( _groupCoreField.childNodes[0] );
                
                // 手札から場に出す
                var _targetCard = this._params._owner._PicCardObject;
                _targetCard.clearEventListener("touchstart");
                _targetCard._sprite.clearEventListener("touchstart");
                
                _groupCardField.addChild( _targetCard );
                _groupCardHand.removeChild( _targetCard );
                
                _gManage._params._bOpenCard = false;
                this._params._parent.removeChild( this._params._group );
            };
            
            _tmpSprite.addEventListener( "touchstart", _func );
            _tmp.addEventListener( "touchstart", _func );
            
            _iPosY += 40;
        }        
        
        // 「閉じる」ボタン
        if ( _gManage._params._iTurnState !== CTcgBattleField.TurnState.iNoneState )
        {
            // 「閉じる」ボタン
            _tmpSprite = _gCommon.CreateSprite( _iPosX, _iPosY, 50, 30, _gCommon.CreateSurface( 50, 50 ) )
            _tmpSprite._params = {};
            _tmpSprite._params._group = _tmpGroup;
            _tmpSprite._params._parent = this._groupCardField;
            _tmpGroup.addChild( _tmpSprite );
            
            _tmp = _gCommon.CreateLabel( _tmpSprite.x + 5, _tmpSprite.y + 5, "Close" );
            _tmp._params = _tmpSprite._params;
            _tmpGroup.addChild( _tmp );
            
            var _func = function() {
                _gManage._params._bOpenCard = false;
                this._params._parent.removeChild( this._params._group );
            };
            
            _tmpSprite.addEventListener( "touchstart", _func );
            _tmp.addEventListener( "touchstart", _func );
            
            _iPosY += 40;
        }        
        
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

/**
 * トラッシュからコアをリザーブに戻す
 * リフレッシュステップ時に処理する
 * @returns {undefined}
 */
CTcgBattlePlayerParams.prototype.MoveCoreReserveFromTrash = function()
{
    var _tmp = null;
    var _iCount = this._groupCoreTrash.childNodes.length;
    for(var i=0; i<_iCount; i++)
    {
        _tmp = this._groupCoreTrash.childNodes[0];
        this._groupCoreField.addChild( _tmp );
        this._groupCoreTrash.removeChild( _tmp );
    }
}






