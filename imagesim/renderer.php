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
 * Short answer question renderer class.
 *
 * @package    qtype
 * @subpackage imagesim
 * @copyright  2009 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();


/**
 * Generates the output for short answer questions.
 *
 * @copyright  2009 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_imagesim_renderer extends qtype_renderer {
    public function formulation_and_controls(question_attempt $qa,
            question_display_options $options) {

        global $CFG;
        global $DB;

        $question = $qa->get_question();
        $currentanswer = $qa->get_last_qt_var('answer');
        $inputname = $qa->get_qt_field_name('answer');
        
        $inputattributes = array(
            'type' => 'text',
            'name' => $inputname,
            'value' => $currentanswer,
            'id' => $inputname,
            'size' => 80,
        );



        /*Variables para los identificadores y nombres del simulador*/
            $frame =  explode("_", $inputname);
            $frame[0] .= "_frame";            
            $texto = explode("_",$inputname);
            $texto[0] .= "_select";            
            $contenedor = explode("_",$inputname);
            $contenedor[0] .= "_cotenedor";            
            $buscador =  explode("_",$inputname);
            $buscador[0].= "_buscador";            
            $direccion = explode(":",$inputname);        
            $direccion[0] = "dir_".$direccion[1];
            $buscador[1] = str_replace(":", "\\\\\\:", $buscador[0]);
            $inputnamescape= str_replace(":", "\\\\\\:", $inputname);
        /**/

        if ($options->readonly) {
            $inputattributes['readonly'] = 'readonly';
        }

        $feedbackimg = '';
        if ($options->correctness) {
            $answer = $question->get_matching_answer(array('answer' => $currentanswer));
            if ($answer) {
                $fraction = $answer->fraction;
            } else {
                $fraction = 0;
            }
            $inputattributes['class'] = $this->feedback_class($fraction);
            $feedbackimg = $this->feedback_image($fraction);
        }

        $questiontext = $question->format_questiontext($qa);
        $placeholder = false;
        if (preg_match('/_____+/', $questiontext, $matches)) {
            $placeholder = $matches[0];
            $inputattributes['size'] = round(strlen($placeholder) * 1.1);
        }
        $input = html_writer::empty_tag('input', $inputattributes) . $feedbackimg;

        if ($placeholder) {
            $inputinplace = html_writer::tag('label', get_string('answer'),
                    array('for' => $inputattributes['id'], 'class' => 'accesshide'));
            $inputinplace .= $input;
            $questiontext = substr_replace($questiontext, $inputinplace,
                    strpos($questiontext, $placeholder), strlen($placeholder));
        }

        $result = html_writer::tag('div', $questiontext, array('class' => 'qtext'));

        if (!$placeholder) {
            $result .= html_writer::start_tag('div', array('class' => 'ablock'));

                //AQUI VA EL BUSCADOR

                /*comentado y cambiado*/
                //$result .= html_writer::tag('label', get_string('answer', 'qtype_imagesim',
                //        html_writer::tag('span', $input, array('class' => 'answer'))),
                //        array('for' => $inputattributes['id']));

                /*cambiado por esto*/

                $prevImg = $question->images;
                //para las preguntas que no cuentan con operaciones o simulador inicial
                if ($question->operations !=null && $question->operations != "") {
                    $iniViewSim = $question->operations;    
                }else{
                    $iniViewSim = '{}';    
                }
                

                $inputname = $qa->get_qt_field_name('answer');

                $generalid =explode("_", $inputname);

                $noChangeID = $generalid[0];

                $generalid = str_replace(":", "_", $generalid[0]);

                $htmlSim = '
                    <div class="fitem rAdded relative">
                        <div class="fitemtitle">
                            <label for="id_defaultmark"> <b>Simulador con valores de inicio</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
                        </div>

                        <div class="felement canvasCont">
                             <div id="initCanvas_'.$generalid.'" class="initCanvas">
                            </div>
                        </div>
                    <div>

                    <div class="buttonRespuesta">
                        <p id="reset'.$generalid.'" class="btnDef" moodleId="'.$generalid.'" class="resDefault">Cargar valores de inicio</p>                    
                        <p class="btnRes renderBtn" moodleId="'.$generalid.'" class="answerGenerate">Guardar</p>                    
                        <div class="w100" id="tmpJsonC2">
                        </div>
                    </div>
               ';

               $redizVar = '';

                $redizVar .= ' 
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/jquery-1.11.1.min.js"></script>
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/jquery-ui.min.js"></script>
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/redizUtils.js"></script>
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/vector.js"></script>
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/imageEdit.js"></script>    
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/imagesim/js/rediz.js"></script>                        

                    <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/imagesim/css/jquery-ui.min.css"/>                        
                    <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/imagesim/css/style.css" />
                    <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/imagesim/css/moodle.css" />
                ';

                $redizVar .= $htmlSim;

                //Se añade la variable con el buscador a la variable que regresa el contenido del render
                $redizVar .= '
                    <script type="text/javascript">
                        var prevImg = \''.$prevImg.'\';
                        var imgObj'.$generalid.';
                        var rootDir = "'.$CFG->wwwroot.'"; 
                        //bandera para saber que es el render
                        var render = true;  
                        
                        if (iniView == undefined) {
                            var iniView = {
                                "initCanvas_'.$generalid.'":'.$iniViewSim.'
                            };
                        }else{
                            iniView["initCanvas_'.$generalid.'"] = '.$iniViewSim.';
                        }

                        //var iniView = '.$iniViewSim.';

                        //console.warn("**********");
                        //console.log(prevImg);
                    
                        //la respuesta se restaura con los valores de la base de datos
                        //var respuesta = [];
                        if (respuesta == undefined){
                            var respuesta = {};
                        }

                        var imagenEditor_'.$generalid.';
                        
                        $(function(){                    
                            imgObj'.$generalid.' = JSON.parse(prevImg);
                                imagenEditor_'.$generalid.' = new imageEdit({
                                idParent:"initCanvas_'.$generalid.'",
                                singularId:"test_'.$generalid.'",      
                                imgPreload: imgObj'.$generalid.'
                            });
                            respuesta["initCanvas_'.$generalid.'"]=[];                        
                            initImgSim();
                            initEventsMoodle();

                            cMoodleEdit = "initCanvas_'.$generalid.'";
                            restartImgSim(imagenEditor_'.$generalid.');

                            $("#reset'.$generalid.'").on("click", function(e){                                
                                eraseAllSim(imagenEditor_'.$generalid.');
                                respuesta["initCanvas_'.$generalid.'"]=[];
                                console.log(\'.answer input[name="'.$noChangeID.'"]\');
                                $(\'.answer input[name="'.$noChangeID.'_answer"]\').attr("value","").text("");
                            })
                        });  
                    </script>
                ';                


                $result .= $redizVar;

                $result .= html_writer::tag('span', $input, array('class' => 'answer'));
                $result .= html_writer::end_tag('div');
        }

        if ($qa->get_state() == question_state::$invalid) {
            $result .= html_writer::nonempty_tag('div',
                    $question->get_validation_error(array('answer' => $currentanswer)),
                    array('class' => 'validationerror'));
        }
         
        

        return $result;
    }

    public function specific_feedback(question_attempt $qa) {
        $question = $qa->get_question();

        $answer = $question->get_matching_answer(array('answer' => $qa->get_last_qt_var('answer')));
        if (!$answer || !$answer->feedback) {
            return '';
        }

        return $question->format_text($answer->feedback, $answer->feedbackformat,
                $qa, 'question', 'answerfeedback', $answer->id);
    }

    public function correct_response(question_attempt $qa) {
        $question = $qa->get_question();

        $answer = $question->get_matching_answer($question->get_correct_response());
        if (!$answer) {
            return '';
        }

        return get_string('correctansweris', 'qtype_imagesim',
                s($question->clean_response($answer->answer)));
    }
}
