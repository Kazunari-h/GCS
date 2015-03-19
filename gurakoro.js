onload =function(){

	/*グラコロのカロリー　427kcal*/
	var sozaiBox = new Array( 16 );
	var copyBox = new Array( 16 );
	var jgBox = new Array( 16 );
	var hantei1 = new Array( 4 );
	var playPoint = 0;
	var countBack = 0;
	var playTurn = 0;
	var kanseiFlg=0;
	var komu = 1;
	var cm = 2;
	var pan = 3;
	var ck = 4;
	var kansei = 5;
	var timer;

		/* タッチ＆フリック機能*/
	var touchStartX;
	var touchStartY;
	var touchMoveX;
	var touchMoveY;
	var moveDistanceX;
	var moveDistanceY;

	//===============================================================================
	// フリックイベント用
	//タッチはじめの位置をとる
	var planA = function(event){
		event.preventDefault();
		// 座標の取得
		touchStartX = event.touches[0].pageX;
		touchStartY = event.touches[0].pageY;
	};

	//タッチ終わりの位置をとる
	var planB = function(event){
		event.preventDefault();
		// 座標の取得
		touchMoveX = event.changedTouches[0].pageX;
		touchMoveY = event.changedTouches[0].pageY;
	};

	//移動量をとる
	var planC = function(event){
		// 移動量の判定
		moveDistanceX = Math.abs(touchStartX-touchMoveX);
		moveDistanceY = Math.abs(touchStartY-touchMoveY);

		if(moveDistanceX > moveDistanceY){
			if (touchStartX > touchMoveX) {
			    if (touchStartX > (touchMoveX + 50)) {
			    //右から左に指が移動した場合
			    	changeBoxleft();
			    	$('left').value = "左" + touchStartX;
			    }
			} else if (touchStartX < touchMoveX) {
			    if ((touchStartX + 50) < touchMoveX) {
			    //左から右に指が移動した場合
			    	changeBoxright();
			    	$('right').value = "右" + touchStartX;
			    }
			}
		} else {
			if (touchStartY > touchMoveY) {
			    if (touchStartY > (touchMoveY + 50)) {
			    //上に指が移動した場合
			    	changeBoxup();
			    	$('up').value = "上" + touchStartX;
			    }
			} else if (touchStartY < touchMoveY) {
			    if ((touchStartY + 50) < touchMoveY) {
			    //下に指が移動した場合
			    	changeBoxdown();
			    	$('down').value = "下" + touchStartX;
			    }
			}
		}
	};


	//タッチのアクション発動。
	function touchAction(){
		// 開始時
		window.addEventListener("touchstart", planA, false);

		// 移動時
		window.addEventListener("touchmove", planB, false);

		// 終了時
		window.addEventListener("touchend", planC, false);
	}

	//タッチアクションを取り消す。無効化する。
	function removeAction(){
		// 開始時
		window.removeEventListener("touchstart", planA, false);

		// 移動時
		window.removeEventListener("touchmove", planB, false);

		// 終了時
		window.removeEventListener("touchend", planC, false);
	}

	//===============================================================================




	//===============================================================================
	// 音楽ファイル再生のためのオブジェクトの初期化　※Phone Gapでは使えない。
	var au = new Audio();
	// 音楽ファイルの設定
	au.src = "se2.wav";
	//===============================================================================



	//===============================================================================

	// ゲームスタートボタンをおした時
	$('button1').onclick = function(){

		// 音楽ファイルの再生
		au.play();
		// ゲームスタート
		gameStart();
		//タッチアクションを有効化
		touchAction();
		// スタート画面を非表示
		$("startTitle").style.display = "none";
		// ゲーム画面を表示
		$("gameDisplay").style.display = "block";

	};


	//===============================================================================
	// PC用テストコントローラー　

	// 上をおした時
	$('up').onclick = function(){
		changeBoxup();
	}
	// 下をおした時
	$('down').onclick = function(){
		changeBoxdown();
	}
	// 左をおした時
	$('left').onclick = function(){
		changeBoxleft();
	}
	// 右をおした時
	$('right').onclick = function(){
		changeBoxright();
	}
	// 戻るをおした時
	$('back').onclick = function(){

		for (var i = 0; i < 16; i++) {
			//前回のコピーを素材ボックスに入れる
			sozaiBox[i] = copyBox[i];
		}
		// 画面に表示
		monitorBox();
		// 戻った回数をカウント
		countBack++;
	}

	/**
	* ゲームスタート関数
	* ①素材ボックスを初期化
	* ②初期の値を配置
	* ③画面に表示
	*/
	function gameStart(){
		// 変数を初期化

		countBack = 0;
		playTurn = 0;
		playPoint = 0;

		// 全ての素材ボックスに0を入れる
		for(var i = 0 ; i< 16 ; i++){
				sozaiBox[i] = 0;
		}

		//3つ初期の値を入れておく
		for(var i = 0 ; i< 3 ; i++){
			//ランダムな位置を設定
			var countC = random(16);
			// もし、ランダムで決めた位置が0ならランダムな値を入れる。
			if(sozaiBox[countC] == 0){
				sozaiBox[countC] = random(4) + 1;
			}else{
				i = i - 1 ;
			}
		}
		// 画面に表示
		monitorBox();
	}

	//パズル画面に空きがあると値を追加する。
	//引数は画面がブロックで埋まってるか埋まってないかを判定。
	function gameCont(p){

		var count = 0;
		var zcont = 0;

		for (var i = 0; i < 16; i++) {
			if (sozaiBox[i] == 0) {
				zcont++;
			}
			if(sozaiBox[i] != copyBox[i]){
				count++;
			}
		}
		if (count <= 0 && zcont != 0) {
			monitorBox(null,p);
		}else if (zcont > 0 ) {
			for(var i = 0 ; i < 1 ; i++){
				var countC = random(16);
				if(sozaiBox[countC] == 0){
					sozaiBox[countC] = random(4) + 1 ;
				}else{
					i = i - 1 ;
				}
			}
			monitorBox(countC,p);
		}else{
			monitorBox(null,p);
			gameOver();
		}
	}

	//ゲームオーバーの処理
	function gameOver(){
		//game overをアラート表示
		window.alert('ゲームオーバー'+playPoint+'キロカロリー');
		//アラート消したらゲームスタート
		gameStart();
	}

	//ボックス等を画面に表示するときに使う。ゲームエフェクト
	function monitorBox(n,p){

		if(n != null){

			var countWhile = 0;
			var countWhileWidth = window.innerWidth;
			var countKansei = 0;
			var countMove = 12;
			var rotateCount = 0;

			if(countWhileWidth <= 320){
				countWhileWidth = 65;
				countKansei = 65;
			}else if(countWhileWidth <= 480){
				countWhileWidth = 65;
				countKansei = 65;
			}else{
				countWhileWidth = 100;
				countKansei = 100;
			}


			$('up').disabled = true;
			$('down').disabled = true;
			$('left').disabled = true;
			$('right').disabled = true;
			moveBox();

			kanseiFlg = 0 ;
			for (var i = 0; i < 16 ; i++) {
				if (sozaiBox[i] == 5 ) {
					kanseiFlg = 1;
				};
			};

			timer = setInterval(function(){
				removeAction();
				if (countWhile < countWhileWidth / 2) {
					$('b'+n).style.width = (countWhile + countWhileWidth / 2 ) + 'px';
					$('b'+n).style.height = (countWhile + countWhileWidth / 2 ) + 'px';
					$('b'+n).style.margin = (( countWhileWidth / 2  - countWhile )/2 ) + 'px';
					$('b'+n).style.lineHeight = (countWhile + countWhileWidth / 2 ) + 'px';
				};

				//動いた時のアクション
				if(p === 1){
					for (var j = 0; j < 16; j++) {
						if(jgBox[j] == 1){
							$('b'+j).style.top = countMove + 'px';
						}
					}
				}else if(p === 2){
					for (var j = 0; j < 16; j++) {
						if(jgBox[j] == 1){
							$('b'+j).style.left = countMove + 'px';
						}
					}
				}else if(p === 3){
					for (var j = 0; j < 16; j++) {
						if(jgBox[j] == 1){
							$('b'+j).style.right = countMove + 'px';
						}
					}
				}else if(p === 4){
					for (var j = 0; j < 16; j++) {
						if(jgBox[j] == 1){
							$('b'+j).style.bottom = countMove + 'px';
						}
					}
				}

				for (var k = 0; k < 16; k++) {

					if (kanseiFlg == 1) {
						if (sozaiBox[k] == 5) {

							//kanseiのエフェクト
							$('b'+k).style.webkitTransform = "rotate("+ rotateCount +"deg)";
							$('b'+k).style.transform = "rotate("+ rotateCount +"deg)";
							rotateCount += 15;
							$('b'+k).style.width = countKansei + 'px';
							$('b'+k).style.height = countKansei + 'px';
							$('b'+k).style.margin = (( countWhileWidth - countKansei)/2 ) + 'px';

							countKansei--;


							if (rotateCount > 720 ) {
								//kanseiのエフェクト
								clearInterval(timer);
								touchAction();
								$('b'+k).style.transform = "rotate("+ 0 +"deg)";
								$('b'+k).style.width = countWhileWidth + 'px';
								$('b'+k).style.height = countWhileWidth + 'px';
								$('b'+k).style.margin = 0+ 'px';
								$('b'+k).style.backgroundImage ='none';
								$('b'+k).style.backgroundColor ='white';
								//揃った時の処理
								playPoint += 427;
								$('point').innerHTML = playPoint;
								sozaiBox[k] = 0;

								$('up').disabled = false;
								$('down').disabled = false;
								$('left').disabled = false;
								$('right').disabled = false;

							}
						}
					}else{
						if (countWhile >= countWhileWidth / 2) {
							clearInterval(timer);
							touchAction();
							$('up').disabled = false;
							$('down').disabled = false;
							$('left').disabled = false;
							$('right').disabled = false;


							for (var j = 0; j < 16; j++) {
								if(jgBox[j] == 1){
									if(p==1){
										$('b'+j).style.top = '0px';
									}else if(p==2){
										$('b'+j).style.left = '0px';
									}else if(p==3){
										$('b'+j).style.right = '0px';
									}else if(p==4){
										$('b'+j).style.bottom = '0px';
									}
								}
							}
						}
					}
				};


				countWhile += 4;

				if(countMove <= 0){
					countMove = 0;
				}else{
					countMove--;
				}

			},10);
		}

		//戻るを使ったアクションの制限。
		if (countBack < 5) {
			if(playTurn === 0){
				$('back').disabled = true;
				$('back').value = "戻る" + playTurn;
			}else{
				$('back').disabled = false;
				$('back').value = "戻る" + playTurn;
			}
		}else{
			$('back').disabled = true;
			$('back').value = "戻る" + playTurn;
		}

		imageDisplay();

		playTurn++;
		$('point').innerHTML = playPoint;

	}

	//素材ボックスの色、画像を決めている。
	function imageDisplay(){
		// 色の設定
		for(var i = 0; i < 16; i++){
			if(sozaiBox[i] == 0){
				$('b'+i).style.backgroundImage = 'none';
				$('b'+i).style.backgroundColor = 'white';
			}else{
				//
				if(sozaiBox[i]== komu){
					$('b'+i).style.backgroundColor = 'yellow';
					$('b'+i).style.backgroundImage = 'url(1.png)';
				}else if(sozaiBox[i]== cm){
					$('b'+i).style.backgroundColor = 'green';
					$('b'+i).style.backgroundImage = 'url(2.png)';
				}else if(sozaiBox[i]== pan){
					$('b'+i).style.backgroundColor = 'violet';;
					$('b'+i).style.backgroundImage = 'url(4.png)';
				}else if(sozaiBox[i]== ck){
					$('b'+i).style.backgroundColor = 'orange';
					$('b'+i).style.backgroundImage = 'url(3.png)';
				}else if(sozaiBox[i]== kansei){
					$('b'+i).style.backgroundColor = 'black';
					$('b'+i).style.backgroundImage = 'url(6.png)';
				}

				// if(n != null && i == n){
				// 	$('b'+n).style.backgroundColor = 'red';
				// }
			}
		}
	}

	//使ってない。
	function judgeGura(){
			//判定
			for (var i = 0; i < 16; i++) {
				if(sozaiBox[i] == 5 ){
				}
			}
			//グラコロの削除と点数加算
	}

	// 上に動かした時のアクション
	function changeBoxup(){

		for (var i = 0; i < 16; i++) {
			copyBox[i] = sozaiBox[i];
		}

		var forCount = 0;
		var no = 0;

		for (var i = 3; i >= 0; i--) {
			no = 0;
			for (var j = 15 ; j >= 0 ; j--) {
				if(j % 4 == forCount){
					hantei1[no] = sozaiBox[j];
					no++;
				}
			}
			//判定の前処理
			changeBox();
			no = 0;
			for (var j = 15 ; j >= 0 ; j--) {
				if(j % 4 == forCount){
					sozaiBox[j] = hantei1[no];
					no++;
				}
			}
			forCount++;
		}

		//judgeGura();
		gameCont(1);

	}

	// 下に動かした時のアクション
	function changeBoxdown(){
		for (var i = 0; i < 16; i++) {
			copyBox[i] = sozaiBox[i];
		}

		var forCount = 0;
		for (var i = 0; i < 4; i++) {
			var no = 0;
			for (var j = 0 ; j < 16 ; j++){
				if(j % 4 == forCount){
					hantei1[no] = sozaiBox[j];
					no++;
				}
			}

			//判定の前処理
			changeBox();
			no = 0;
			for (var j = 0 ; j < 16 ; j++){
				if(j % 4 == forCount){
					sozaiBox[j] = hantei1[no];
					no++;
				}
			}
			forCount++;
		}
		//judgeGura();
		gameCont(4);
	}

	// 左に動かした時のアクション
	function changeBoxleft(){
		for (var i = 0; i < 16; i++) {
			copyBox[i] = sozaiBox[i];
		}
		for (var i = 0; i < 4; i++) {
			var no = 0;
			for (var j = 15 ; j >= 0 ; j--){
				if(j < ( i + 1 ) * 4 && j >= i * 4 ){
					hantei1[no] = sozaiBox[j];
					no++;
				}
			}

			//判定の前処理
			changeBox();

			no = 0;

			for (var j = 15 ; j >= 0 ; j--){
				if(j < ( i + 1 ) * 4 && j >= i * 4 ){
					sozaiBox[j] = hantei1[no];
					no++;
				}
			}

		}

		//judgeGura();
		gameCont(2);

	}

	// 右に動かした時のアクション
	function changeBoxright(){

		for (var i = 0; i < 16; i++) {
			copyBox[i] = sozaiBox[i];
		}

		for (var i = 0; i < 4; i++) {

			var no = 0;
			for (var j = 0 ; j < 16 ; j++){
				if(j < ( i + 1 ) * 4 && j >= i * 4 ){
					hantei1[no] = sozaiBox[j];
					no++;
				}
			}

			//判定の前処理
			changeBox();
			no = 0;
			for (var j = 0 ; j < 16 ; j++){
				if(j < ( i + 1 ) * 4 && j >= i * 4 ){
					sozaiBox[j] = hantei1[no];
					no++;
				}
			}
		}
		//judgeGura();
		gameCont(3);
	}


	// 判定
	function changeBox(){

		if(
			(hantei1[0] == ck　&& hantei1[1] == pan && hantei1[2] == ck ) ||
			(hantei1[1] == ck　&& hantei1[2] == pan && hantei1[3] == ck ) ||
			(hantei1[0] == ck　&& hantei1[1] == pan && hantei1[3] == ck && hantei1[2] == 0) ||
			(hantei1[0] == ck　&& hantei1[2] == pan && hantei1[3] == ck && hantei1[1] == 0)){

				if(hantei1[1] == ck && hantei1[2] == pan && hantei1[3] == ck){

					hantei1[1] = 0;
					hantei1[2] = 0;
					hantei1[3] = kansei;

				}else if(hantei1[0] == ck && hantei1[2] == pan && hantei1[3] == ck && hantei1[1] == 0) {

					hantei1[0] = 0;
					hantei1[2] = 0;
					hantei1[3] = kansei;

				}else if(hantei1[0] == ck && hantei1[1] == pan && hantei1[3] == ck && hantei1[2] == 0){

					hantei1[0] = 0;
					hantei1[1] = 0;
					hantei1[3] = kansei;

				}else {

					hantei1[0] = 0;
					hantei1[1] = 0;
					hantei1[2] = kansei;

				}

		}

		if((hantei1[0] == hantei1[1] &&　hantei1[1] == hantei1[2] && hantei1[2] == hantei1[3] && hantei1[0] == komu )){

				hantei1[0] = 0;
				hantei1[1] = 0;
				hantei1[2] = 0;
				hantei1[3] = 0;
				hantei1[3] = ck;

		}

		if(
				(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[2] && hantei1[0] == komu) ||
				(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[2] == 0) ||
				(hantei1[0] == hantei1[2] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == 0) ||
				(hantei1[1] == hantei1[2] && hantei1[1] == hantei1[3] && hantei1[1] == komu) ){


				if(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[2] && hantei1[0] == komu){

					hantei1[0] = 0;
					hantei1[1] = 0;

					hantei1[2] = pan;

				}

				if(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[2] == 0){

					hantei1[0] = 0;
					hantei1[1] = 0;

					hantei1[3] = pan;

				}

				if(hantei1[0] == hantei1[2] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == 0){

					hantei1[0] = 0;
					hantei1[2] = 0;

					hantei1[3] = pan;

				}

				if(hantei1[1] == hantei1[2] && hantei1[1] == hantei1[3] && hantei1[1] == komu ){

					hantei1[1] = 0;
					hantei1[2] = 0;

					hantei1[3] = pan;

				}



		}

		if(
			(hantei1[0] == hantei1[1] && hantei1[0] == komu ) ||
			(hantei1[1] == hantei1[2] && hantei1[1] == komu ) ||
			(hantei1[2] == hantei1[3] && hantei1[2] == komu ) ||
			(hantei1[0] == hantei1[2] && hantei1[0] == komu && hantei1[1] == 0) ||
			(hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == hantei1[2] && hantei1[1] == 0) ||
			(hantei1[1] == hantei1[3] && hantei1[1] == komu && hantei1[2] == 0)){


				if(hantei1[2] == hantei1[3] && hantei1[2] == komu){

					hantei1[2] = 0;
					hantei1[3] = cm;

				}

				if(hantei1[1] == hantei1[2] && hantei1[1] == komu){

					hantei1[1] = 0;
					hantei1[2] = cm;

				}

				if(hantei1[1] == hantei1[3] && hantei1[1] == komu && hantei1[2] == 0){

					hantei1[1] = 0;
					hantei1[3] = cm;

				}

				if(hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == hantei1[2] && hantei1[1] == 0){

					hantei1[0] = 0;
					hantei1[3] = cm;

				}

				if(hantei1[0] == hantei1[2] && hantei1[0] == komu && hantei1[1] == 0){

					hantei1[0] = 0;
					hantei1[2] = cm;

				}

				if(hantei1[0] == hantei1[1] && hantei1[0] == komu ){

					hantei1[0] = 0;
					hantei1[1] = cm;

				}

		//クリーム　●●○○、●○●○、●○○●、○●●○、○●○●、○○●●の　場合クリームコロッケ
		}
		if(
			(hantei1[0] == hantei1[1] && hantei1[0] == cm ) ||
			(hantei1[0] == hantei1[2] && hantei1[0] == cm && hantei1[1] == 0) ||
			(hantei1[0] == hantei1[3] && hantei1[0] == cm && hantei1[1] == hantei1[2] && hantei1[1] == 0) ||
			(hantei1[1] == hantei1[3] && hantei1[1] == cm && hantei1[2] == 0) ||
			(hantei1[1] == hantei1[2] && hantei1[1] == cm ) ||
			(hantei1[2] == hantei1[3] && hantei1[2] == cm ) ){


			if(hantei1[2] == hantei1[3] && hantei1[2] == cm ){

				hantei1[2] = 0;
				hantei1[3] = ck;

			}

			if(hantei1[1] == hantei1[2] && hantei1[2] == cm ){

				hantei1[1] = 0;
				hantei1[2] = ck;

			}

			if(hantei1[1] == hantei1[3] && hantei1[1] == cm && hantei1[2] == 0){

				hantei1[1] = 0;
				hantei1[3] = ck;

			}

			if(hantei1[0] == hantei1[3] && hantei1[0] == cm && hantei1[1] == hantei1[2] && hantei1[1] == 0){

				hantei1[0] = 0;
				hantei1[3] = ck;

			}

			if(hantei1[0] == hantei1[2] && hantei1[0] == cm && hantei1[1] == 0){

				hantei1[0] = 0;
				hantei1[2] = ck;

			}

			if (hantei1[0] == hantei1[1] && hantei1[0] == cm ) {

				hantei1[0] = 0;
				hantei1[1] = ck;

			}

		}

		alignmentBox();

	}

	/*　全てを端に寄せる */
	function alignmentBox(){
		for (var j = 3; j >= 0 ; j--) {
			for (var i = 3; i > 0; i--) {
				if(hantei1[i] == 0 ){
					hantei1[i] = hantei1[i - 1] ;
					hantei1[i - 1] = 0;
				}
			}
		}
	}

	/*　動いたボックスの位置を記録　*/
	function moveBox(){
		for (var i = 0; i < 16; i++) {
			if(sozaiBox[i] != copyBox[i] && sozaiBox[i] != 0){
				jgBox[i] = 1 ;
			}else{
				jgBox[i] = 0 ;
			}
		}
	}

	/*　便利かな？*/
	function $(id){
		return document.getElementById(id);
	}

	//0~iのランダムな数字を出力する
	function random(i){
		return Math.floor(Math.random() * i);
	}

}
