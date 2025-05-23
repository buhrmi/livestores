require "application_system_test_case"

class LivestoreTest < ApplicationSystemTestCase

  test 'subscribing, updating, appending' do
    visit '/messages'
    assert_text 'henlo'
    click_on 'Make Message'
    assert_text 'Hello World'
    assert_text 'newnew'
    assert_text 'Large Number: 1000'
    assert_text 'Word: hellochunk2'
  end
end
