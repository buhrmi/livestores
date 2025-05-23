require "application_system_test_case"

class LivestoreTest < ApplicationSystemTestCase

  test 'subscribing, updating, appending' do
    visit '/messages'
    assert_text 'henlo'
    assert_text "Object value: old"
    click_on 'Make Message'
    assert_text 'Hello World'
    assert_text 'newnew'
    assert_text 'Large Number: 1000'
    assert_text 'word: hellochunk2'
    assert_text "Object value: Hello World"
  end
end
