
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

    this._lblRemainLibrary = null;
    
    // 山札の初期化
    var _i;
    for ( _i=0; _i<10; _i++ )
    {
      this._CardLibrary[ _i ] = _i;
    }
    
    this.ShuffleLibrary();
    this.InitializeCardLibrary();
    this.InitializeCardHand();
    
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
    
    _tmpGroup = _gCommon.CreateGroup( _i * 0, 0 );

    _img = _gCommon.CreateSurface( 50, 50 );
    _tmp = _gCommon.CreateSprite( 0, 0, 50, 50, _img );
    _tmpGroup.addChild( _tmp );

    _tmp = _gCommon.CreateLabel( 0, 0, "" + this._CardHand[ _i ] );
    _tmpGroup.addChild( _tmp );

    this._groupCardHand.addChild( _tmpGroup );
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
