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
 * Question type class for the h_calc_sim Test question type.
 *
 * @package    qtype
 * @subpackage textoprocesador
 * @copyright  1999 onwards Martin Dougiamas  {@link http://moodle.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/questionlib.php');
require_once($CFG->dirroot . '/question/engine/lib.php');
require_once($CFG->dirroot . '/question/type/textoprocesador/question.php');


/**
 * The textoprocesador Test question type.
 *
 * @copyright  1999 onwards Martin Dougiamas  {@link http://moodle.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_textoprocesador extends question_type {
    public function extra_question_fields() {

        return array('qtype_procesadortx_options', 'usecase','initsim','resultsim', 'answprev'); //-IS

    }

    public function move_files($questionid, $oldcontextid, $newcontextid) {
        parent::move_files($questionid, $oldcontextid, $newcontextid);
        $this->move_files_in_answers($questionid, $oldcontextid, $newcontextid);
        $this->move_files_in_hints($questionid, $oldcontextid, $newcontextid);
    }

    protected function delete_files($questionid, $contextid) {
        parent::delete_files($questionid, $contextid);
        $this->delete_files_in_answers($questionid, $contextid);
        $this->delete_files_in_hints($questionid, $contextid);
    }


    /*
        -IS amod functions
        added 2 storage sim data on DB
    */
    public function save_init_sim($question){
        /*global $DB;
        $context = $question->context;

        $select = "questionid = " .$question->id. "";
        $oldInitsim = $DB->get_record_select('qtype_h_calc_sim_options',$select);*/

       // echo "<h3>Aqui se debe de guardar la informacion del simulador inicial</h3>";
        //var_dump($context);
        //var_dump($context->get_data());
        //var_dump($oldInitsim->resultsim);
        //echo "<hr><hr>";

        //$answer->id = $DB->insert_record('question_answers', $answer);
        return;

    }
    public function save_result_sim($question){
        /*echo "<h3>Aqui se debe de guardar la informacion del simulador resultado</h3>";
        var_dump($question->id);
        echo "<br><br><br><br>";*/
        return;
    }
    /*  END -IS*/

    public function save_question_options($question) {
        global $DB;

        $result = new stdClass();

        $context = $question->context;

        /*echo "<h3>Context</h3>";
        var_dump($context);
        echo "<br><hr><br>";
        echo "<h3>Question</h3>";
        var_dump($question);*/


        // Perform sanity checks on fractional grades.
        $maxfraction = -1;
        foreach ($question->answer as $key => $answerdata) {
            if ($question->fraction[$key] > $maxfraction) {
                $maxfraction = $question->fraction[$key];
            }
        }

        if ($maxfraction != 1) {
            $result->error = get_string('fractionsnomax', 'question', $maxfraction * 100);
            return $result;
        }

        parent::save_question_options($question);

        $this->save_question_answers($question);

        $this->save_hints($question);

        //$this->save_init_sim($question); //-IS add

        //$this->save_result_sim($question);  //-IS add

    }

    protected function fill_answer_fields($answer, $questiondata, $key, $context) {
        $answer = parent::fill_answer_fields($answer, $questiondata, $key, $context);
        $answer->answer = trim($answer->answer);
        return $answer;
    }

    protected function initialise_question_instance(question_definition $question, $questiondata) {
        parent::initialise_question_instance($question, $questiondata);
        $this->initialise_question_answers($question, $questiondata);
    }

    public function get_random_guess_score($questiondata) {
        foreach ($questiondata->options->answers as $aid => $answer) {
            if ('*' == trim($answer->answer)) {
                return $answer->fraction;
            }
        }
        return 0;
    }

    public function get_possible_responses($questiondata) {
        $responses = array();

        $starfound = false;
        foreach ($questiondata->options->answers as $aid => $answer) {
            $responses[$aid] = new question_possible_response($answer->answer,
                    $answer->fraction);
            if ($answer->answer === '*') {
                $starfound = true;
            }
        }

        if (!$starfound) {
            $responses[0] = new question_possible_response(
                    get_string('didnotmatchanyanswer', 'question'), 0);
        }

        $responses[null] = question_possible_response::no_response();

        return array($questiondata->id => $responses);
    }
}
