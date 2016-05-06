/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * コモンクラス
 * @returns {CCommon}
 */
var CCommon = function() 
{
    // パラメータ
    this.param = 
    {
        font: "16px cursive",
        textAlign: "left"
    };
    
    // ラベルの作成
    this.CreateLabel = function( iPosX, iPosY, strMsg )
    {
        // ラベル作成
        var _lbl = new Label( strMsg );
        _lbl.x = iPosX;
        _lbl.y = iPosY;
        _lbl.font = this.param.font;
        _lbl.textAlign = this.param.textAlign;
        
        return _lbl;
    };
    
    // サーフェスの作成
    this.CreateSurface = function( iWidth, iHeight )
    {
        var _surf = new Surface( iWidth, iHeight );
        _surf.context.beginPath();
        _surf.context.fillStyle = "rgba(128,128,128,0.8)";
        _surf.context.fillRect( 0, 0, iWidth, iHeight );
        _surf.context.stroke();
        
        return _surf;
    };
    
    // スプライトの作成
    this.CreateSprite = function( iPosX, iPosY, iWidth, iHeight, image )
    {
        var _sprite = new Sprite( iWidth, iHeight );
        _sprite.x = iPosX;
        _sprite.y = iPosY;
        _sprite.image = image;
        
        return _sprite;
    };
    
    // グループの作成
    this.CreateGroup = function( iPosX, iPosY )
    {
        var _group = new Group();
        _group.x = iPosX;
        _group.y = iPosY;
        
        return _group;
    };
};

