export class EmotionClassifier {

  private previousParameters: number[] = [];
  private classifier: any = {};
  private emotions: any[] = [];
  private coefficient_length: number;
  private emotionModel = {
  	"enojo" : {
      "bias" : -2.3768163629,
      "coefficients" : [-0.026270300474413848, -0.037963304603547195, -0.25318394482150264, 0.36801694354709802, 0.059638621925431838, -6.3145056900010567e-17, 0.094520059272651849, 0.21347244366388901, 0.42885313652690621, -1.5592214434343613e-14, 0.13850079872874066, -5.1485910666665307e-16, 0.33298910350203975, 8.0357363919330235e-16, 0.0025325096363696059, -0.44615090964065951, -1.5784656134660036e-15, 0.047596008125675944],
    },
  	"disgusto" : {
  		"bias" : -2.27900176842,
  		"coefficients" : [0.042360511043701296, -0.1282033922181087, -0.12391812407152457, 0.27567823277270387, -0.1421150306247343, 3.1081856766624292e-16, 0.12612972927139088, 0.23426310789552218, 0.058894842405560956, -4.0618311657856847e-15, 0.22340906131116328, -5.81584759084207e-15, 0.25735218595500009, 1.3658078149815552e-15, -0.12506850140605949, -0.9463447584787309, -4.555025133881674e-15, 0.07141679477545719],
  	},
  	"miedo" : {
  		"bias" : -3.40339917096,
  		"coefficients" : [-0.1484066846778026, 0.090079860583144475, 0.16138464891003612, -0.078750143250805593, -0.070521075864349317, -3.6426173865029096e-14, 0.54106033239630258, 0.049586639890528791, -0.10793093750863458, -5.1279691693889055e-15, -0.092243236155683667, -1.5165430767377168e-14, 0.19842076279793416, 3.8282960479670228e-15, -0.67367184030514637, -0.2166709100861198, 1.1995348541944584e-14, -0.20024153378658624],
  	},
  	"tristeza" : {
      "bias" : -2.75274632938,
      "coefficients" : [0.092611010001705449, 0.12883530427748521, 0.068975994604949298, 0.19623077060801897, -0.055312197843294802, 3.5874521027522394e-16, 0.46315306348086854, -0.32103622843654361, -0.46536626891885491, 1.725612051187888e-14, -0.40841535552399683, 2.1258665882389598e-14, 0.45405204011625938, 5.9194289392226669e-15, 0.094410500655151899, -0.4861387223131064, -3.030330454831321e-15, 0.73708254653765559],
    },
  	"sorpresa" : {
      "bias" : -2.86262062696,
      "coefficients" : [-0.12854109490879712, 0.049194392540246726, 0.22856553950573175, -0.2992140056765602, 0.25975558754705375, -1.4688408313649554e-09, -0.13685597104348368, -0.23581884244542603, 0.026447180058097462, 1.6822695398601112e-10, 0.095712304864421921, -4.4670230074132591e-10, 0.40505706085269738, 2.7821987602166784e-11, -0.54367856543588833, -0.096320945782919151, 1.4239801195516449e-10, -0.7238167998685946],
    },
  	"felicidad" : {
      "bias" : -1.4786712822,
      "coefficients" : [0.014837209675880276, -0.31092627456808286, 0.1214238695400552, -0.45265837869400843, -0.36700140259900887, -1.7113646510738279e-15, -0.4786251427206033, -0.15377369505521801, -0.16948121903942992, 6.0300272629176253e-15, -0.021184992727875669, -6.9318606881292957e-15, -0.81611603551588852, -3.7883560238442657e-15, 0.1486320646217055, 0.94973410351769527, 3.6260400713070416e-15, -0.31361179943007411],
    },
  };

  constructor() {
    for (var m in this.emotionModel) {
    //  console.log(m)
      this.emotions.push(m);
      this.classifier[m] = {};
      this.classifier[m]['bias'] = this.emotionModel[m]['bias'];
      this.classifier[m]['coefficients'] = this.emotionModel[m]['coefficients'];
    }
  //  console.log(this.classifier)
    this.coefficient_length = this.classifier[this.emotions[0]]['coefficients'].length;
  }

  private predict(parameters: any) {
    var prediction: any = [];
    for (var j: number = 0; j < this.emotions.length; j++) {
      var e = this.emotions[j];
      var score = this.classifier[e].bias
      for (var i = 0; i < this.coefficient_length; i++) {
        score += this.classifier[e].coefficients[i] * parameters[i + 6];
      }
      prediction[j] = { "emotion": e, "value": 0.0 };
      prediction[j]['value'] = 1.0 / (1.0 + Math.exp(-score))*100;
    }
    return prediction;
  }

  public meanPredict(parameters: any) {
  //  console.log(parameters)
    // store to array of 10 previous parameters
    this.previousParameters.splice(0, this.previousParameters.length == 10 ? 1 : 0);
  //  console.log(this.previousParameters)
    this.previousParameters.push(parameters.slice(0));

      if (this.previousParameters.length > 9) {
          // calculate mean of parameters?
          var meanParameters: any[] = []
          for (var i = 0; i < parameters.length; i++) {
            meanParameters[i] = 0;
          }
          for (var i = 0; i < this.previousParameters.length; i++) {
            for (var j = 0; j < parameters.length; j++) {
              meanParameters[j] += this.previousParameters[i][j];
            }
          }
          for (var i = 0; i < parameters.length; i++) {
            meanParameters[i] /= 10;
          }

          // calculate logistic regression
          return this.predict(meanParameters);
        } else {
          return false;
        }
  }
}
