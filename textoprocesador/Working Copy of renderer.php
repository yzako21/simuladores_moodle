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
 * textoprocesador Test question renderer class.
 *
 * @package    qtype
 * @subpackage textoprocesador
 * @copyright  2009 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();


/**
 * Generates the output for textoprocesador Test questions.
 *
 * @copyright  2009 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_textoprocesador_renderer extends qtype_renderer {
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

            /*
                var_dump( $inputattributes['type']);
                echo "<br>";
                var_dump( $inputattributes['name']);
                echo "<br>";
			
                var_dump( $inputattributes['value']);
                echo "PRUEBA";
				echo $question->initsim;
			
                var_dump( $inputattributes['id']);
                echo "<br>";
                var_dump( $inputattributes['size']);
            */

            $result .= ' 
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/jquery-1.8.3.min.js"/></script>
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/jquery-ui.min.js"/></script>
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/jquery.sheet.js"/> </script>  
                
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/rediz.js"/> </script>  


                <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/textoprocesador/css/base.css"/>

                ';

			//recuperar las respuestas para usarlas en el javaScript            
			
			//$OpVar = $this->$question->initsim;
			//$prevAnsw = $this->$question->resultsim;
			//Procesador ATTO
			$OpVar = str_replace("|-|", "<", $question->initsim);
			$OpVar = str_replace(" \" ", " \\\' ", $OpVar);
			$editor  = editors_get_preferred_editor(); //Escoje el procesador de texto
			$editOpt = array(
					'context' => $options->context
			);
			$editor->use_editor($inputname, $editOpt, array(
						'text' => $OpVar,
						'context' => $options->context
			));
			
			$result .= html_writer::tag('textarea', $OpVar, array(
					'text' => $question->initsim,
					'name' => $inputname,
					'id' => $inputname,
					'rows' => 25,
					'cols' => 80
			));
		
			$generalid =explode("_", $inputname);
			$generalid = $generalid[0];
            $result .= '   
                    <div class="w100">                        
                        <a href="#" id="resDefault" class="w40">Cargar valores por defecto</a>                        
                        <a href="#" moodleId="'.$generalid.'" id="answerGenerate" class="w40">Generar Respuesta</a>
                    </div>    
					<br><br>
                  ';
		
            $result .= html_writer::tag('span', $input, array('class' => 'answer'));


            $result .= html_writer::end_tag('div');

        }

        if ($qa->get_state() == question_state::$invalid) {
            $result .= html_writer::nonempty_tag('div',
                    $question->get_validation_error(array('answer' => $currentanswer)),
                    array('class' => 'validationerror'));
        }

        //echo $question->initsim;

        $redizVar = '<script type="text/javascript">

          var questionData = "PRUEBA 1"
            ,   restSim
            ;

            var render = true;

            var rootDir = "'.$CFG->wwwroot.'";
		
            var answerId;

            //variables para almacenar los dos estados de respuesta (inicial/final)
            var iniAnswer
            ,   resAnswer
            ;

            $(function(){                    
              
               answerId = "'.$inputattributes["id"].'";  
		       
			   
                $("#preguntaSim").html(questionData); 

                init();
            }); 

        </script>';        
        
        $result .= $redizVar;

        return $result;
    }

	protected function get_editor_options($context) {
        return array(
            'context' => $context
        );
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

        return get_string('correctansweris', 'qtype_textoprocesador',
                s($question->clean_response($answer->answer)));
    }
}
