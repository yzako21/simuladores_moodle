<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Defines the editing form for the imagesim question type.
 *
 * @package    qtype
 * @subpackage imagesim
 * @copyright  2017 Moguel Isaac
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();


/**
 * Image editor question editing form definition.
 *
 * @copyright  2017 Moguel Isaac
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_imagesim_edit_form extends question_edit_form {

    protected function defaultsims(){
        global $CFG;
        global $DB;

        $htmlSim = '


        <div class="fitem rAdded initSim relative">
            <div class="fitemtitle">
                <label for="id_defaultmark"> <b>Editor con valores iniciales</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
            </div>

            <div class="felement canvasCont">
                 <div id="initCanvas" class="initCanvas">
                </div>
            </div>

            <div class="w100" id="">
                    <p id="bDuplica_imgsim">Establecer simulador inicial</p>
            </div>
        </div>

        <div class="fitem rAdded relative">
            <div class="fitemtitle">
                <label for="id_defaultmark"> <b>Editor de imagen para generar respuesta</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
            </div>

            <div class="felement canvasCont">
                 <div id="resCanvas" class="resCanvas">
                </div>
            </div>
        </div>

        <div class="buttonRespuesta">
            <p class="btnRes">Guardar respuesta</p>
            <div class="selectCal">
                <p class=""><b>Calificación: </b></p>
                <select name="" id="answCal">
                    <option value="1.0"  selected="selected">100%</option>
                    <option value="0.9">90%</option>
                    <option value="0.8333333">83.33333%</option>
                    <option value="0.8">80%</option>
                    <option value="0.75">75%</option>
                    <option value="0.7">70%</option>
                    <option value="0.6666667">66.66667%</option>
                    <option value="0.6">60%</option>
                    <option value="0.5">50%</option>
                    <option value="0.4">40%</option>
                    <option value="0.3333333">33.33333%</option>
                    <option value="0.3">30%</option>
                    <option value="0.25">25%</option>
                    <option value="0.2">20%</option>
                    <option value="0.1666667">16.66667%</option>
                    <option value="0.1428571">14.28571%</option>
                    <option value="0.125">12.5%</option>
                    <option value="0.1111111">11.11111%</option>
                    <option value="0.1">10%</option>
                    <option value="0.05">5%</option>
                </select>
            </div>

            <div class="w100" id="tmpJsonC2">

            </div>
        </div>


        <div class="imgUpDesc felement rAdded relative">
        </div>

        <script type="text/javascript">
            var init_imgObj = {};
            var imgObj = {};

            var render = false;
            var rootDir = "'.$CFG->wwwroot.'";

            //la respuesta se restaura con los valores de la base de datos
            var respuesta = {};

            var imagenEditor_initCanvas,
                imagenEditor_resCanvas
            ;

            $(function(){
                //console.log(imgObj);
                //alert("Restart function");

                    console.log(imgObj);
                    /*Para cargar las imagenes desde la BD Moodle*/
                    imagenEditor_initCanvas = new imageEdit({
                        idParent:"initCanvas",
                        singularId:"test",
                        imgPreload: init_imgObj
                    });

                    imagenEditor_resCanvas = new imageEdit({
                        idParent:"resCanvas",
                        singularId:"test2",
                        imgPreload: imgObj
                    });

                //espacio para las operaciones realizadas en los editores de imagen
                respuesta["initCanvas"]=[];
                respuesta["resCanvas"]=[];

                initImgSim();
                initMoodleAddBtn();
                initMoodleEraseBtn();
                initEventsMoodle();

                //restartImgSim();


                //console.log(imagenEditor_initCanvas);
                //console.log(imagenEditor_resCanvas);
            });



        </script>
       ';

        return $htmlSim;
    }

    protected function restartsims(){
        global $CFG;
        global $DB;

      $prevImg = $this->question->options->images;
       $iniViewSim = $this->question->options->operations;

      // si no se genero un simulador inicial, lo marca como vacio
       if (count($iniViewSim) < 3) {
         $iniViewSim = '{}';
       }

        $htmlSim = '
        <div class="fitem rAdded initSim relative">
            <div class="fitemtitle">
                <label for="id_defaultmark"> <b>Editor con valores iniciales</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
            </div>

            <div class="felement canvasCont">
                 <div id="initCanvas" class="initCanvas">
                </div>
            </div>

            <div class="w100" id="">
                    <a href="#" id="bDuplica_imgsim">Establecer simulador inicial</a>
            </div>
        </div>


        <div class="fitem rAdded relative">
            <div class="fitemtitle">
                <label for="id_defaultmark"> <b>Editor de imagen para generar respuesta</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
            </div>

            <div class="felement canvasCont">
                 <div id="resCanvas" class="resCanvas">
                </div>
            </div>
        </div>

        <div class="buttonRespuesta">
            <p class="btnRes">Generar respuesta</p>
            <div class="selectCal">
                <p class=""><b>Calificación: </b></p>
                <select name="" id="answCal">
                    <option value="1.0" selected="selected">100%</option>
                    <option value="0.9">90%</option>
                    <option value="0.8333333">83.33333%</option>
                    <option value="0.8">80%</option>
                    <option value="0.75">75%</option>
                    <option value="0.7">70%</option>
                    <option value="0.6666667">66.66667%</option>
                    <option value="0.6">60%</option>
                    <option value="0.5">50%</option>
                    <option value="0.4">40%</option>
                    <option value="0.3333333">33.33333%</option>
                    <option value="0.3">30%</option>
                    <option value="0.25">25%</option>
                    <option value="0.2">20%</option>
                    <option value="0.1666667">16.66667%</option>
                    <option value="0.1428571">14.28571%</option>
                    <option value="0.125">12.5%</option>
                    <option value="0.1111111">11.11111%</option>
                    <option value="0.1">10%</option>
                    <option value="0.05">5%</option>
                    </select>
            </div>


            <div class="w100" id="tmpJsonC2">

            </div>

            <h4 class="tituloSec">Agregar imágenes al banco de imágenes <small>Disponibilidad para el alumno</small></h4>
        </div>

        <div class="imgUpDesc felement rAdded relative">
        </div>


            <script type="text/javascript">

                var prevImg = \''.$prevImg.'\';
                //var iniView = '.$iniViewSim.';
                if (iniView == undefined) {
                    var iniView = {
                        "initCanvas":'.$iniViewSim.'
                    };
                }else{
                    iniView["initCanvas"] = '.$iniViewSim.';
                }

                console.warn("AAAAAAAAAAAAA");
                console.log(iniView);

                var init_imgObj = {};
                var imgObj;
                var render = false;
                var rootDir = "'.$CFG->wwwroot.'";

                //la respuesta se restaura con los valores de la base de datos
                var respuesta = {};

                var imagenEditor_initCanvas
                ,   imagenEditor_resCanvas
                ;

                $(function(){
                    imgObj = JSON.parse(prevImg);
                    console.log(imgObj);

                    //var currentImg = JSON.parse($("input#id_images").val());

                    //se añaden las existentes en la base
                    var imgD_Template = $(\'<div class="imgDesc"><img src="" alt=""><div class="textoImagen"><label class="obligatoria">Nombre:</label><input class="nameUp "type="text" ><label>Texto alternativo</label><input placeholder="Opcional" class="altTextUp" type="text"><label>Formato:</label><input class="formatUp" disabled="disabled" type="text"><p class="saveImgMoodle saved erase">Eliminar</></div></div>\')
                    for (key in imgObj) {

                        var tmpD = imgD_Template.clone();
                        tmpD.find("img").attr("src",imgObj[key].src);
                        tmpD.find(".formatUp").val(imgObj[key].format);
                        tmpD.find(".altTextUp").val(imgObj[key].alt || "");
                        tmpD.find(".nameUp").val(imgObj[key].nombre);

                        tmpD.find("input.nameUp").on("keyup", function(e){
                            tmpD.find(".saveImgMoodle").addClass("saved").text("Imagen guardada");
                        });

                        //Para guardar las imagenes de la pregunta
                        tmpD.find(".saveImgMoodle").on("click", function(e){
                        console.log("???");
                        var nombre = $(this).parent().find("input.nameUp").val();
                        console.warn(nombre);
                        if (nombre.length > 0) {
                            if ( $(this).hasClass("saved") ) {
                                console.log("Eliminar guardado");
                                $(this).removeClass("saved erase");
                                $(this).text("Agregar a base de imágenes");
                            }else{
                                console.log("guardada");
                                $(this).addClass("saved");
                                $(this).text("Imagen guardada");
                            }
                        }else{
                            alert("La imagen no se puede agregar al banco de imágenes sin nombre. Introduzca un nombre para identificar a la imagen.");
                        }
                        });

                        $(".imgUpDesc").append(tmpD);
                        //imagenesAbase[key] = imgObj[key];
                    }


                    //alert("Restart function");

                        console.log(imgObj);
                        /*Para cargar las imagenes desde la BD Moodle*/
                        imagenEditor_initCanvas = new imageEdit({
                            idParent:"initCanvas",
                            singularId:"test",
                            imgPreload: init_imgObj
                        });

                        imagenEditor_resCanvas = new imageEdit({
                            idParent:"resCanvas",
                            singularId:"test2",
                            imgPreload: imgObj
                        });
                    respuesta["initCanvas"]=[];
                    respuesta["resCanvas"]=[];

                    initImgSim();
                    initMoodleAddBtn();
                    initMoodleEraseBtn();
                    initEventsMoodle();

                    cMoodleEdit = "initCanvas";

                    restartImgSim(imagenEditor_initCanvas);

                });
            </script>

       ';

        return $htmlSim;
    }

    protected function definition_inner($mform) {
        global $CFG;
        global $DB;



        $menu = array(
            get_string('caseno', 'qtype_imagesim'),
            get_string('caseyes', 'qtype_imagesim')
        );
        /*$mform->addElement('select', 'usecase',
                get_string('casesensitive', 'qtype_imagesim'), $menu);*/


         /*
            -IS
            BANDERAS PARA LA CARGA DEL SIMULADOR INICIAL Y SIULADOR RESULTADO
        */
        $mform->addElement('text', 'operations',"Operaciones"); //keywords db field
        $mform->setType('operations', PARAM_NOTAGS); //Set type of element
        $mform->setDefault('operations', '{}');        //Default value

        $mform->addElement('text', 'answer',"Respuesta"); //keywords db field
        $mform->setType('answer', PARAM_NOTAGS); //Set type of element
        $mform->setDefault('answer', '');        //Default value

        $mform->addElement('text', 'images',"Imágenes"); //keywords db field
        $mform->setType('images', PARAM_NOTAGS); //Set type of element
        $mform->setDefault('images', '');        //Default value


        $mform->addElement('html','
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/jquery-1.11.1.min.js"></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/jquery-ui.min.js"></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/redizUtils.js"></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/vector.js"></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/imageEdit.js"></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/rediz.js"></script>

            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/imagesim/css/jquery-ui.min.css"/>
            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/imagesim/css/style.css" />
            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/imagesim/css/moodle.css" />



        ');

        /* -ISE */

        if (!isset($this->question->options)){
            $OpVar ="";
            $mform->addElement('html',$this->defaultsims());
        }else{
            //$OpVar = $this->question->options->keywords;
            $mform->addElement('html',$this->restartsims());
        }

        /*
        //asi estaba en calc_sim
        if ($OpVar == "" || $OpVar == '[{"title":"Hoja 1","rows":[{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]}],"metadata":{"widths":["120px","120px","120px","120px","120px"],"frozenAt":{"row":0,"col":0}}}]'){
            $mform->addElement('html',$this->defaultsims());
        }
        else{
            $mform->addElement('html',$this->restartsims());
        }*/

        $mform->addElement('static', 'answersinstruct',
                get_string('correctanswers', 'qtype_imagesim'),
                get_string('filloutoneanswer', 'qtype_imagesim'));
        $mform->closeHeaderBefore('answersinstruct');

        $this->add_per_answer_fields($mform, get_string('answerno', 'qtype_imagesim', '{no}'),
                question_bank::fraction_options());

        $this->add_interactive_settings();
    }

    protected function get_more_choices_string() {
        return get_string('addmoreanswerblanks', 'qtype_imagesim');
    }

    protected function data_preprocessing($question) {
        $question = parent::data_preprocessing($question);
        $question = $this->data_preprocessing_answers($question);
        $question = $this->data_preprocessing_hints($question);

        return $question;
    }

    public function validation($data, $files) {
        $errors = parent::validation($data, $files);
        $answers = $data['answer'];
        $answercount = 0;
        $maxgrade = false;
        foreach ($answers as $key => $answer) {
            $trimmedanswer = trim($answer);
            if ($trimmedanswer !== '') {
                $answercount++;
                if ($data['fraction'][$key] == 1) {
                    $maxgrade = true;
                }
            } else if ($data['fraction'][$key] != 0 ||
                    !html_is_blank($data['feedback'][$key]['text'])) {
                $errors["answeroptions[$key]"] = get_string('answermustbegiven', 'qtype_imagesim');
                $answercount++;
            }
        }
        if ($answercount==0) {
            $errors['answeroptions[0]'] = get_string('notenoughanswers', 'qtype_imagesim', 1);
        }
        if ($maxgrade == false) {
            $errors['answeroptions[0]'] = get_string('fractionsnomax', 'question');
        }
        return $errors;
    }

    public function qtype() {
        return 'imagesim';
    }
}
