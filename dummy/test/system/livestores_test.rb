require "application_system_test_case"

class LivestoreTest < ApplicationSystemTestCase

  test 'subscribing, updating, appending' do
    visit '/messages'
    assert_text 'old1old3'
    assert_text "123456"
    assert_text "henlo"
    assert_text "foundme"
    click_on 'Make Message'
    assert_no_text "foundme"
    assert_text "gotcha"
    assert_text 'newnew'
    

  end
end
