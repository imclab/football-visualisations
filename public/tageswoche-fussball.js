// Generated by CoffeeScript 1.3.3

(function($) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.tageswoche = this.tageswoche || {};

  tageswoche.field = (function() {
    return {
      scorePosition: {
        om: 40,
        um: 40,
        ol: 65,
        ul: 65,
        or: 15,
        ur: 15
      },
      originalWidth: 1152,
      widthHeightRelation: 1152 / 760,
      cellWidth: 64,
      heights: [67, 67, 67, 67, 73, 80, 73, 67, 67, 67, 67],
      scale: 1,
      playDirection: "left",
      calcPosition: function(position, mirror) {
        var height, index, x, y, _i, _len, _ref;
        if (mirror == null) {
          mirror = false;
        }
        position = this.parsePosition(position, mirror);
        x = (position.horizontal - 1) * this.cellWidth;
        y = 0;
        _ref = this.heights;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          height = _ref[index];
          if ((index + 1) < position.vertical) {
            y += height;
          }
        }
        x += this.cellWidth / 2;
        y += this.heights[position.vertical - 1] / 2;
        return {
          x: this.scale * x,
          y: this.scale * y
        };
      },
      goalPosition: function(scorePosition) {
        var height, index, position, x, y, _i, _len, _ref;
        position = {
          horizontal: 1,
          vertical: 6
        };
        x = this.playDirection === "left" ? 20 : this.originalWidth - 20;
        y = this.scorePosition[scorePosition];
        _ref = this.heights;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          height = _ref[index];
          if ((index + 1) < position.vertical) {
            y += height;
          }
        }
        return {
          x: this.scale * x,
          y: this.scale * y
        };
      },
      parsePosition: function(position, mirror) {
        var charCode, horizontalPosition, letter, verticalPositon;
        if (mirror == null) {
          mirror = false;
        }
        position = position.trim();
        letter = position.charAt(0);
        charCode = letter.toLowerCase().charCodeAt(0);
        horizontalPosition = charCode - 96;
        verticalPositon = position.charAt(1);
        if (mirror) {
          return {
            horizontal: 19 - horizontalPosition,
            vertical: 12 - verticalPositon
          };
        } else {
          return {
            horizontal: horizontalPosition,
            vertical: verticalPositon
          };
        }
      }
    };
  })();

  this.tageswoche = this.tageswoche || {};

  tageswoche.curve = (function() {
    var percentRegex;
    percentRegex = /(\d+)%/;
    return {
      curve: function(start, end, curvedness, curvePosition, direction) {
        var controlPoint, path;
        if (curvedness == null) {
          curvedness = 0;
        }
        if (curvePosition == null) {
          curvePosition = 0.5;
        }
        controlPoint = this.bezierControlPoint(start, end, curvedness, curvePosition, direction);
        path = "M" + [start.x, start.y];
        return path += "C" + [controlPoint.x, controlPoint.y, end.x, end.y, end.x, end.y];
      },
      wavy: function(start, end, curvedness) {
        var controlPoint1, controlPoint2, path;
        controlPoint1 = this.bezierControlPoint(start, end, curvedness, 0.35, "right");
        controlPoint2 = this.bezierControlPoint(start, end, curvedness, 0.65, "left");
        path = "M" + [start.x, start.y];
        return path += "C" + [controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, end.x, end.y];
      },
      arrow: function(base, tip, pointyness) {
        var path, pointA, pointB, size;
        if (pointyness == null) {
          pointyness = 0.5;
        }
        size = this.distance(base, tip) * pointyness;
        pointA = this.bezierControlPoint(base, tip, size, 0, "right");
        pointB = this.bezierControlPoint(base, tip, size, 0, "left");
        path = "M" + [pointB.x, pointB.y];
        path += "L" + [tip.x, tip.y];
        return path += "L" + [pointA.x, pointA.y];
      },
      line: function(start, end) {
        return "M" + [start.x, start.y] + "L" + [end.x, end.y];
      },
      distance: function(start, end) {
        var deltaX, deltaY;
        deltaX = end.x - start.x;
        deltaY = end.y - start.y;
        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
      },
      intermediatePoint: function(start, end, fraction) {
        var deltaX, deltaY;
        deltaX = end.x - start.x;
        deltaY = end.y - start.y;
        return {
          x: start.x + (deltaX * fraction),
          y: start.y + (deltaY * fraction)
        };
      },
      bezierControlPoint: function(start, end, curvedness, curvePosition, direction) {
        var angularVector, intermediatePoint, normVector, percent;
        if (direction == null) {
          direction = "right";
        }
        if (percent = this.percent(curvedness)) {
          curvedness = this.distance(start, end) * percent;
        }
        intermediatePoint = this.intermediatePoint(start, end, curvePosition);
        normVector = this.normVector(start, end);
        angularVector = direction === "left" ? this.rotateVectorClockwise(normVector) : this.rotateVectorCounterClockwise(normVector);
        return this.add(intermediatePoint, this.multiply(angularVector, curvedness));
      },
      percent: function(percent) {
        var result;
        result = percentRegex.exec(percent);
        if (result) {
          return result[1] / 100;
        } else {
          return void 0;
        }
      },
      multiply: function(vector, multiplicator) {
        return {
          x: vector.x * multiplicator,
          y: vector.y * multiplicator
        };
      },
      add: function(vector1, vector2) {
        return {
          x: vector1.x + vector2.x,
          y: vector1.y + vector2.y
        };
      },
      normVector: function(start, end) {
        var deltaX, deltaY, distance, normX, normY;
        deltaX = end.x - start.x;
        deltaY = end.y - start.y;
        distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
        normX = deltaX / distance;
        normY = deltaY / distance;
        return {
          x: normX,
          y: normY
        };
      },
      rotateVectorClockwise: function(vector) {
        return {
          x: vector.y,
          y: -vector.x
        };
      },
      rotateVectorCounterClockwise: function(vector) {
        return {
          x: -vector.y,
          y: vector.x
        };
      },
      delta: function(start, end) {
        return {
          x: end.x - start.x,
          y: end.y - start.y
        };
      },
      slope: function(start, end) {
        var delta;
        delta = this.delta(start, end);
        return delta.y / delta.x;
      },
      inverseSlope: function(start, end) {
        return -1 / this.slope(start, end);
      }
    };
  })();

  this.tageswoche = this.tageswoche || {};

  tageswoche.data = (function() {
    var specialConditions;
    specialConditions = {
      "Freistoss direkt": "fd",
      "Freistoss indirekt": "fi",
      "Ecke": "e",
      "Penalty": "p",
      "Penaltyschiessen": "ps",
      "Einwurf": "ew",
      "Foul": "f"
    };
    return {
      is: function(condition, code) {
        if (condition && code) {
          return specialConditions[condition] === code.toLowerCase();
        } else {
          return false;
        }
      },
      scenes: void 0,
      games: {},
      current: -1,
      addSceneToGame: function(index, scene) {
        var game, _base, _name, _ref;
        game = (_ref = (_base = this.games)[_name = scene.date]) != null ? _ref : _base[_name] = [];
        this.scenes.push(scene);
        return game.push(index);
      },
      firstScene: function() {
        var game, lastScene;
        lastScene = this.scenes[this.scenes.length - 1];
        game = this.games[lastScene.date];
        this.current = game[0];
        return this.scenes[this.current];
      },
      nextScene: function() {
        if (!this.isLastScene()) {
          this.current += 1;
        }
        return this.scenes[this.current];
      },
      isLastScene: function() {
        return this.current === (this.scenes.length - 1);
      },
      previousScene: function() {
        if (!this.isFirstScene()) {
          this.current -= 1;
        }
        return this.scenes[this.current];
      },
      isFirstScene: function() {
        return this.current === 0;
      },
      getScene: function(index) {
        this.current = index;
        return this.scenes[this.current];
      },
      loadScenes: function(callback) {
        var _this = this;
        if (this.scenes) {
          callback(void 0, this.scenes);
          return;
        }
        $.ajax({
          url: "http://tageswoche.herokuapp.com/fcb/situations",
          dataType: "jsonp"
        }).done(function(data) {
          var entry, index, _i, _len;
          data = data.list;
          _this.scenes = [];
          for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
            entry = data[index];
            if (!/g:/i.test(entry.scorePosition)) {
              _this.addSceneToGame(index, {
                actions: entry.playerPositions,
                score: entry.score,
                minute: entry.minute,
                opponent: entry.opponent,
                team: entry.team,
                home: entry.homematch,
                date: entry.date,
                competition: entry.competition,
                scorePosition: entry.scorePosition
              });
            }
          }
          return callback(void 0, _this.scenes);
        });
      },
      loadScenesFake: function(callback) {
        var data, entry, index, newData;
        data = [
          {
            score: "1:0",
            minute: 85,
            date: "01.06.2012",
            opponent: "GC",
            team: "FCB",
            home: true,
            tournament: "l",
            scorePosition: "OM",
            actions: [
              {
                name: "Stocker",
                number: 5,
                positions: ["H1"]
              }, {
                name: "Park",
                number: 8,
                positions: ["E1", "C10"]
              }, {
                name: "Streller",
                number: 10,
                positions: ["E9", "A8"]
              }, {
                name: "D. Degen",
                number: 7,
                positions: ["C7"]
              }
            ]
          }, {
            score: "2:0",
            minute: 86,
            date: "01.06.2012",
            opponent: "GC",
            team: "FCB",
            home: true,
            tournament: "l",
            scorePosition: "UL",
            actions: [
              {
                name: "Frei",
                number: 11,
                positions: ["H4", "F4"]
              }, {
                name: "Park",
                number: 8,
                positions: ["E6"]
              }, {
                name: "Frei",
                number: 11,
                positions: ["C5"]
              }
            ]
          }, {
            score: "1:0",
            minute: 14,
            date: "01.07.2012",
            opponent: "Servette",
            team: "FCB",
            home: true,
            tournament: "l",
            scorePosition: "UL",
            actions: [
              {
                name: "Frei",
                number: 11,
                positions: ["H6"]
              }, {
                name: "Park",
                number: 8,
                positions: ["E5", "E4"]
              }, {
                name: "Frei",
                number: 11,
                positions: ["C3"]
              }
            ]
          }
        ];
        this.scenes = data;
        this.games = {};
        newData = (function() {
          var _i, _len, _results;
          _results = [];
          for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
            entry = data[index];
            _results.push(this.addSceneToGame(entry, index));
          }
          return _results;
        }).call(this);
        return callback(void 0, data);
      }
    };
  })();

  /* RAPHAEL CLASS
  */


  this.RaphaelMap = (function() {

    function RaphaelMap(container, width, height) {
      this.container = container;
      this.width = width;
      this.height = height;
      this.map = Raphael(this.container, this.width, this.height);
    }

    RaphaelMap.prototype.scale = function(svgs, ratio) {
      var svg, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = svgs.length; _i < _len; _i++) {
        svg = svgs[_i];
        _results.push(svg.scale(ratio, ratio, 0, 0));
      }
      return _results;
    };

    return RaphaelMap;

  })();

  /* SOCCERMAP CLASS
  */


  this.SoccerMap = (function(_super) {
    var curve, data, field;

    __extends(SoccerMap, _super);

    curve = tageswoche.curve;

    field = tageswoche.field;

    data = tageswoche.data;

    function SoccerMap(container, width, settings) {
      var height, self;
      this.settings = settings != null ? settings : {};
      self = this;
      field.scale = width / field.originalWidth;
      height = width / field.widthHeightRelation;
      SoccerMap.__super__.constructor.call(this, container, width, height);
      this.scene = void 0;
      this.actions = [];
      this.black = "#555555";
      this.red = "#EE402F";
      this.blue = "#0051A3";
      this.white = "#FFFFFF";
      this.fcbAttributes = {
        fill: this.red,
        stroke: "",
        "stroke-width": 1.0,
        "stroke-linejoin": "round"
      };
      this.opponentAttributes = {
        fill: this.black,
        stroke: "",
        "stroke-width": 1.0,
        "stroke-linejoin": "round"
      };
      this.numberTextAttributes = {
        fill: "#FFFFFF",
        stroke: "none",
        font: '200 13px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif'
      };
      this.circleRadius = 11;
      this.playerColor = this.red;
      this.playerAttributes = this.fcbAttributes;
      this.initEvents();
      this.firstScene();
    }

    SoccerMap.prototype.firstScene = function() {
      var _this = this;
      return data.loadScenes(function(error, scenes) {
        _this.scene = data.firstScene();
        return _this.draw();
      });
    };

    SoccerMap.prototype.nextScene = function() {
      this.scene = data.nextScene();
      if (data.isLastScene()) {
        $("#next-scene").css("visibility", "hidden");
      } else {
        $("#prev-scene").css("visibility", "visible");
      }
      return this.draw();
    };

    SoccerMap.prototype.previousScene = function() {
      this.scene = data.previousScene();
      if (data.isFirstScene()) {
        $("#prev-scene").css("visibility", "hidden");
      } else {
        $("#next-scene").css("visibility", "visible");
      }
      return this.draw();
    };

    SoccerMap.prototype.initEvents = function() {
      var _this = this;
      $("#next-scene").click(function() {
        event.preventDefault();
        return _this.nextScene();
      });
      $("#prev-scene").click(function() {
        event.preventDefault();
        return _this.previousScene();
      });
      return $("#scene-list").on("click", "a", function(event) {
        var $this, scene, sceneIndex;
        event.preventDefault();
        $this = $(event.target);
        sceneIndex = $this.parent().data("sceneIndex");
        scene = data.scenes[sceneIndex];
        _this.scene = data.getScene(sceneIndex);
        return _this.draw();
      });
    };

    SoccerMap.prototype.draw = function() {
      var action, first, last, _i, _len, _ref;
      if (this.scene.team.toLowerCase() === "fcb") {
        field.playDirection = "left";
        this.playerColor = this.red;
        this.playerAttributes = this.fcbAttributes;
      } else {
        field.playDirection = "right";
        this.playerColor = this.black;
        this.playerAttributes = this.opponentAttributes;
      }
      this.actions = this.scene.actions;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        first = action.positions[0];
        last = action.positions.length > 1 ? action.positions[action.positions.length - 1] : void 0;
        action.start = field.calcPosition(first);
        if (last) {
          action.end = field.calcPosition(last);
        }
      }
      this.map.clear();
      this.drawPasses();
      this.drawPositions();
      this.updateInfo();
      return this.sceneInfo();
    };

    SoccerMap.prototype.updateInfo = function() {
      var $gameLink, game, scene, sceneIndex, ul, _i, _len, _results;
      $("#scene-result .score").html(this.scene.score);
      $("#scene-result .left").html("FCB");
      if (this.scene.opponent) {
        $("#scene-result .right").html(this.scene.opponent.toUpperCase());
      }
      game = data.games[this.scene.date];
      ul = $("#scene-list").html("");
      _results = [];
      for (_i = 0, _len = game.length; _i < _len; _i++) {
        sceneIndex = game[_i];
        scene = data.scenes[sceneIndex];
        $gameLink = $("<li><a href='' class='" + (scene === this.scene ? "active" : void 0) + "'>" + scene.minute + ".</a></li>");
        $gameLink.data("sceneIndex", sceneIndex);
        _results.push(ul.append($gameLink));
      }
      return _results;
    };

    SoccerMap.prototype.extractSceneInfo = function() {
      var assistAction, goalAction, length;
      length = this.actions.length;
      if (length) {
        goalAction = this.actions[length - 1];
        if (!data.is("Foul", goalAction.specialCondition)) {
          this.scene.goal = goalAction.name;
          if (data.is("Penalty", goalAction.specialCondition)) {
            this.scene.goal = "" + this.scene.goal + " (Penalty)";
          } else if (data.is("Freistoss direkt", goalAction.specialCondition)) {
            this.scene.goal = "" + this.scene.goal + " (Freistoss direkt)";
          } else if (data.is("Freistoss indirekt", goalAction.specialCondition)) {
            this.scene.goal = "" + this.scene.goal + " (Freistoss indirekt)";
          }
          if (length > 1) {
            assistAction = this.actions[length - 2];
            if (!data.is("Foul", assistAction.specialCondition)) {
              return this.scene.assist = assistAction.name;
            }
          }
        }
      }
    };

    SoccerMap.prototype.sceneInfo = function() {
      var desc;
      this.extractSceneInfo();
      desc = $("#scene-desc").html("").append("<em>" + this.scene.team + " &ndash; " + this.scene.minute + ". Minute:</em>").append("<span>Tor: <strong>" + this.scene.goal + "</strong></span>");
      if (this.scene.assist) {
        return desc.append("<span>Assist: <strong>" + this.scene.assist + "</strong></span>");
      }
    };

    SoccerMap.prototype.drawPasses = function() {
      var action, lastPosition, _i, _len, _ref;
      lastPosition = void 0;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        if (action.end) {
          this.drawSprint(action.start, action.end);
        }
        if (lastPosition) {
          this.addPass(lastPosition, action.start);
        }
        if (data.is("Foul", action.specialCondition)) {
          lastPosition = void 0;
        } else {
          lastPosition = action.end ? action.end : action.start;
        }
      }
      if (lastPosition) {
        return this.drawGoal(lastPosition);
      }
    };

    SoccerMap.prototype.drawPositions = function() {
      var action, currentAttributes, player, start, _i, _len, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        currentAttributes = action.number ? this.fcbAttributes : this.playerAttributes;
        if (action.end) {
          start = action.start;
          player = action.end;
        } else {
          player = action.start;
        }
        if (start) {
          this.map.circle(start.x, start.y, this.circleRadius * 0.5).attr(currentAttributes);
        }
        this.map.circle(player.x, player.y, this.circleRadius).attr(currentAttributes);
        if (action.number) {
          _results.push(this.label(player, action.number));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SoccerMap.prototype.drawSprint = function(start, end) {
      var path;
      path = curve.wavy(start, end, "10%");
      return this.map.path(path).attr({
        fill: "",
        stroke: this.playerColor,
        "stroke-width": 2
      });
    };

    SoccerMap.prototype.addPass = function(start, end) {
      var endGap, length, path, startGap, subCurve;
      path = curve.curve(start, end, "10%", 0.6, "right");
      startGap = 0;
      endGap = 16;
      length = Raphael.getTotalLength(path);
      subCurve = Raphael.getSubpath(path, startGap, length - endGap);
      this.drawArrow(path, {
        length: length - endGap
      });
      return this.map.path(subCurve).attr({
        fill: "",
        stroke: this.white,
        "stroke-width": 2
      });
    };

    SoccerMap.prototype.drawGoal = function(start) {
      var end, foot, path;
      end = field.goalPosition(this.scene.scorePosition.toLowerCase());
      foot = start.y < end.y ? "left" : "right";
      if (field.playDirection === "right") {
        foot = foot === "left" ? "right" : "left";
      }
      path = curve.curve(start, end, "10%", 0.6, foot);
      this.drawArrow(path, {
        size: 10,
        pointyness: 0.3,
        strokeWidth: 3
      });
      return this.map.path(path).attr({
        fill: "",
        stroke: this.white,
        "stroke-width": 3
      });
    };

    SoccerMap.prototype.drawArrow = function(path, _arg) {
      var arrowhead, base, color, length, pointyness, size, strokeWidth, tip;
      length = _arg.length, size = _arg.size, pointyness = _arg.pointyness, strokeWidth = _arg.strokeWidth, color = _arg.color;
      if (length == null) {
        length = Raphael.getTotalLength(path);
      }
      if (size == null) {
        size = 10;
      }
      if (pointyness == null) {
        pointyness = 0.3;
      }
      if (strokeWidth == null) {
        strokeWidth = 2;
      }
      if (color == null) {
        color = this.white;
      }
      if ((length - size) > 5) {
        base = Raphael.getPointAtLength(path, length - size);
        tip = Raphael.getPointAtLength(path, length);
        arrowhead = curve.arrow(base, tip, pointyness);
        return this.map.path(arrowhead).attr({
          fill: "",
          stroke: color,
          "stroke-width": strokeWidth
        });
      }
    };

    SoccerMap.prototype.label = function(position, label) {
      var x;
      x = position.x;
      if (+label > 9 && +label < 20) {
        x -= 1;
      }
      return this.map.text(x, position.y, label).attr(this.numberTextAttributes);
    };

    return SoccerMap;

  })(RaphaelMap);

}).call(this, jQuery);
