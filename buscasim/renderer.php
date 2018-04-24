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
 * @subpackage buscasim
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
class qtype_buscasim_renderer extends qtype_renderer {
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
                //$result .= html_writer::tag('label', get_string('answer', 'qtype_buscasim',
                //        html_writer::tag('span', $input, array('class' => 'answer'))),
                //        array('for' => $inputattributes['id']));

                /*cambiado por esto*/

                $inputname = $qa->get_qt_field_name('answer');

                $redizVar = ' 
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/buscasim/js/jquery-1.8.3.min.js"/></script>
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/buscasim/js/jquery-ui.min.js"/></script>

                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/buscasim/js/rediz.js"/> </script>  

                    <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/buscasim/css/jquery-ui.min.css"/>            
                    <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/buscasim/css/base.css"/>            

                ';

                //Se añade la variable con el buscador a la variable que regresa el contenido del render
                $redizVar .= '
                    <script type="text/javascript">
                        //Evitar conflictos con jQuery 
                        $j = jQuery.noConflict(true);
                        var render = true;
                        var direccion="";
                        var cx = "'.$question->cw.'";
                        //var gKey = "013729188999357642701:esf3ikdxubs";

                        $j(function(){                    

                           console.warn("cargando el render");

                           questionData = "'.$question->keywords.'";
                           answerId = "'.$inputattributes["id"].'";                                              
                           initBuscador();

    
                            console.warn("'.$inputname.'");
                        }); 
                    </script>
                ';                 

                $redizVar .= '                    
                    <div id="contenedor_buscador" data-moodleId="'.$inputattributes["id"].'" class = "contenedor_buscador" style="width:100%; height:450px" overflow-y:hidden;>
                        <!--<input  onclick = obtener("'.$inputnamescape.'") type="button" style="margin-left:65%;" value="Escoger página." name="texto" id="'.$direccion[0].'"/>-->
                        <img class="gBuscaImg" src="'.$CFG->wwwroot.'/question/type/buscasim/img/buscatic.png" width="40%"  style="float:left;" alt="">
                        <br style="clear:both;">
                        <div id="'.$buscador[0].'" class="buscador">                            
                            <script type="text/javascript">                        
                                  (function()
                                  {
                                   //You need to change this value with your own key
                                    //var cx = "017396960115407619298:l-psxfhfxau";
                                    //console.warn(cx)
                                    //cx = "013729188999357642701:esf3ikdxubs";
                                    var gcse = document.createElement("script");
                                    gcse.type = "text/javascript";
                                    
                                    //console.warn("'.$frame[0].'");
                                    gcse.linkTarget = "'.$frame[0].'";
                                    gcse.async = true;
                                    
                                    gcse.src = (document.location.protocol == "https:" ? "https:" : "http:") +
                                        "//www.google.com/cse/cse.js?cx=" + cx;
                                    var s = document.getElementsByTagName("script")[0];
                                    
                                    s.parentNode.insertBefore(gcse, s);

                                    console.log(gcse);
                                    console.log("---------");
                                    console.log(s);
                                                                
                                  })();
                            </script>        
                             <gcse:search linkTarget="'.$frame[0].'" enableAutoComplete ></gcse:search>
                        </div>

                        <img class="resImg" src="'.$CFG->wwwroot.'/question/type/buscasim/img/arrow.png" alt="resultadi" >

                        <div class="frameCont">
                            <iframe class="frame" id ="'.$frame[0].'" name="'.$frame[0].'"  height="100%" width="100%" ">
                                    <p>Tu buscador no soporta Marcos</p>
                            </iframe>
                        </div>                        
                        <br />
                    </div>
                ';

                $redizVar .= '

                    <!--<p> <b>Keywords: </b>'.$question->keywords.'</p>-->
                    <p style="clear:both" class="ansRediz"><b>Tu respuesta actual es: </b></p>  
                ';


                $result .= $redizVar;


                $result .= html_writer::tag('span', $input, array('class' => 'answer ansRediz'));
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

        return get_string('correctansweris', 'qtype_buscasim',
                s($question->clean_response($answer->answer)));
    }
}
