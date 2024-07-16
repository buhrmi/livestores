require "application_system_test_case"

class LivestoreTest < ApplicationSystemTestCase

  test 'subscribing, updating, appending' do
    visit '/'
    assert_text 'henlo'
    click_on 'Make Message'
    assert_text 'Hello World'
  end
end
